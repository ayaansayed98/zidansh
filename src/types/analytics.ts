export interface ProductInteraction {
  id: string;
  product_name: string;
  product_brand: string;
  product_price: number;
  interaction_type: 'view' | 'cart_add' | 'wishlist_add' | 'search' | 'purchase';
  user_session: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_name: string;
  product_brand: string;
  product_price: number;
  quantity: number;
  user_session: string;
  created_at: string;
}

export interface CheckoutData {
  id: string;
  customer_info: {
    phone_number: string;
    email_address: string;
  };
  cart_items: CartItem[];
  total_amount: number;
  payment_method: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';
  order_number: string;
  user_session: string;
  created_at: string;
}
