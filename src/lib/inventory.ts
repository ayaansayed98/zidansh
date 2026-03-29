import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';

export interface CartItem {
    id: string; // Cart Item ID
    productId?: number;
    quantity: number;
    size?: string;
    name?: string;
}

export const inventoryService = {
    // Update stock for purchased items
    async updateStock(items: CartItem[]): Promise<void> {
        console.log('Updating stock for items:', items);

        // Process each item
        for (const item of items) {
            if (!item.productId) {
                console.warn('Item missing productId, skipping stock update:', item);
                continue;
            }

            try {
                // If size is present, we look for the variation
                if (item.size) {
                    // First, find the variation ID for this product + size
                    const fetchUrl = new URL(`${SUPABASE_URL}/rest/v1/product_variations`);
                    fetchUrl.searchParams.append('product_id', `eq.${item.productId}`);
                    fetchUrl.searchParams.append('size', `eq.${item.size}`);
                    fetchUrl.searchParams.append('select', 'variation_id, stock');

                    const getResponse = await fetch(fetchUrl.toString(), {
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                        }
                    });

                    if (!getResponse.ok) {
                        console.error(`Error finding variation for product ${item.productId} size ${item.size}:`, await getResponse.text());
                        continue;
                    }

                    const variationsData = await getResponse.json();
                    const variation = variationsData[0];

                    if (variation) {
                        const newStock = Math.max(0, (variation.stock || 0) - item.quantity);

                        const updateUrl = new URL(`${SUPABASE_URL}/rest/v1/product_variations`);
                        updateUrl.searchParams.append('variation_id', `eq.${variation.variation_id}`);

                        const updateResponse = await fetch(updateUrl.toString(), {
                            method: 'PATCH',
                            headers: {
                                'apikey': SUPABASE_ANON_KEY,
                                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ stock: newStock })
                        });

                        if (!updateResponse.ok) {
                            console.error(`Failed to update stock for ${item.name} (${item.size}):`, await updateResponse.text());
                        } else {
                            console.log(`Stock updated for ${item.name} (${item.size}). New stock: ${newStock}`);
                        }
                    } else {
                        console.warn(`No variation found for product ${item.productId} size ${item.size}`);
                    }

                } else {
                    console.warn(`Item ${item.name} has no size, skipping variation stock update.`);
                }

            } catch (err) {
                console.error('Unexpected error updating stock:', err);
            }
        }
    }
};
