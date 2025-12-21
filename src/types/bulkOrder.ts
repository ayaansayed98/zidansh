export interface BulkOrder {
  id: number;
  type: string;
  quantity: number;
  details?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface NewBulkOrder {
  type: string;
  quantity: number;
  details?: string;
}
