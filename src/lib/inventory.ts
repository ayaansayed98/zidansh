import { supabase } from './supabase';

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
                    const { data: variations, error: varError } = await supabase
                        .from('product_variations')
                        .select('variation_id, stock')
                        .eq('product_id', item.productId)
                        .eq('size', item.size)
                        .single(); // Should be unique per product+size

                    if (varError) {
                        console.error(`Error finding variation for product ${item.productId} size ${item.size}:`, varError);
                        continue;
                    }

                    if (variations) {
                        const newStock = Math.max(0, (variations.stock || 0) - item.quantity);

                        const { error: updateError } = await supabase
                            .from('product_variations')
                            .update({ stock: newStock })
                            .eq('variation_id', variations.variation_id);

                        if (updateError) {
                            console.error(`Failed to update stock for ${item.name} (${item.size}):`, updateError);
                        } else {
                            console.log(`Stock updated for ${item.name} (${item.size}). New stock: ${newStock}`);
                        }
                    } else {
                        console.warn(`No variation found for product ${item.productId} size ${item.size}`);
                    }

                } else {
                    // No size, assume main product stock? 
                    // In this apps structure, everything seems to be variation based (from import script).
                    // But if there's no size, maybe it's a product without variations?
                    // Let's warn for now.
                    console.warn(`Item ${item.name} has no size, skipping variation stock update.`);
                }

            } catch (err) {
                console.error('Unexpected error updating stock:', err);
            }
        }
    }
};
