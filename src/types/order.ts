export interface OrderItem {
    id: string;
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
    size?: string;
    image?: string;
}

export interface Order {
    id: string;
    order_id: string;
    user_email?: string;
    user_phone?: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total_amount: number;
    items: OrderItem[];
    shipping_address: {
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
    payment_method: string;
    payment_status: 'pending' | 'paid' | 'failed';
    created_at: string;
}
