
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY; // Or SERVICE_ROLE_KEY if you have RL restricted
const CSV_PATH = path.resolve(__dirname, '../../featured_products_inventory.csv');

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your environment.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
        // Handle quoted strings (e.g. "Product Name, with comma")
        const values = [];
        let currentVal = '';
        let insideQuote = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                insideQuote = !insideQuote;
            } else if (char === ',' && !insideQuote) {
                values.push(currentVal.trim());
                currentVal = '';
            } else {
                currentVal += char;
            }
        }
        values.push(currentVal.trim());

        // Map headers to values
        const entry = {};
        headers.forEach((header, index) => {
            // Remove quotes from values if present
            let val = values[index];
            if (val && val.startsWith('"') && val.endsWith('"')) {
                val = val.slice(1, -1);
            }
            entry[header] = val;
        });
        return entry;
    });
}

async function importData() {
    try {
        console.log(`Reading CSV from: ${CSV_PATH}`);
        if (!fs.existsSync(CSV_PATH)) {
            throw new Error(`File not found: ${CSV_PATH}`);
        }

        const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
        const records = parseCSV(csvContent);

        console.log(`Parsed ${records.length} records. Preparing to upsert...`);

        const debugRecord = records.find(r => r['Variation_ID'] === 'var_4_1');
        if (debugRecord) {
            console.log('DEBUG: Found var_4_1 in CSV:', debugRecord);
        } else {
            console.log('DEBUG: var_4_1 NOT FOUND in CSV');
        }

        const upsertData = records.map(record => ({
            variation_id: record['Variation_ID'],
            product_id: parseInt(record['Product_ID']),
            product_name: record['Product_Name'],
            brand: record['Brand'],
            cloth_type: record['Cloth_Type'],
            sku: record['SKU'],
            size: record['Size'],
            price: parseFloat(record['Price']),
            original_price: parseFloat(record['Original_Price']),
            stock: parseInt(record['Current_Stock']),
            low_stock_threshold: parseInt(record['Low_Stock Threshold']),
            is_active: record['Is Active']?.toUpperCase() === 'TRUE'
        }));

        // Process in chunks to avoid hitting payload limits
        const CHUNK_SIZE = 50;
        for (let i = 0; i < upsertData.length; i += CHUNK_SIZE) {
            const chunk = upsertData.slice(i, i + CHUNK_SIZE);
            const { error } = await supabase
                .from('product_variations')
                .upsert(chunk, { onConflict: 'variation_id' });

            if (error) {
                console.error('Error upserting chunk:', error);
            } else {
                console.log(`Upserted variations ${i + 1} to ${Math.min(i + CHUNK_SIZE, upsertData.length)}`);
            }
        }

        console.log('Import completed successfully!');

    } catch (err) {
        console.error('Import failed:', err);
    }
}

importData();
