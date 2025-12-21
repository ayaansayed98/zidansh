export interface Customer {
  id: string;
  phone_number: string;
  email_address: string;
  order_number: string;
  type_of_clothes: string;
  quantity: number;
  payment_amount: number;
  type_of_payment: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';
  created_at: string;
  updated_at: string;
}

export interface NewCustomer {
  phone_number: string;
  email_address: string;
  order_number: string;
  type_of_clothes: string;
  quantity: number;
  payment_amount: number;
  type_of_payment: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';
}
