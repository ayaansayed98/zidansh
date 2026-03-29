import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';
import { Customer, NewCustomer } from '../types/customer';
import { User, NewUser, SignInAttempt, OrderTrackingRequest } from '../types/user';
import { NewsletterSubscription, NewNewsletterSubscription } from '../types/newsletter';
import { BulkOrder, NewBulkOrder } from '../types/bulkOrder';

// Customer Service
export const customerService = {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(customer: NewCustomer): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, updates: Partial<Customer>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// User Service
export const userService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getUserByPhone(phoneNumber: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email_address', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async create(user: NewUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserSignin(userId: string): Promise<void> {
    // First get the current signin_count
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('signin_count')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from('users')
      .update({
        last_signin_at: new Date().toISOString(),
        signin_count: (user.signin_count || 0) + 1
      })
      .eq('id', userId);

    if (error) throw error;
  },

  async trackSigninAttempt(attempt: Omit<SignInAttempt, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('signin_tracking')
      .insert(attempt);

    if (error) throw error;
  },

  async trackOrderTrackingRequest(request: OrderTrackingRequest): Promise<void> {
    const { error } = await supabase
      .from('order_tracking_requests')
      .insert(request);

    if (error) throw error;
  }
};

// Newsletter Service
export const newsletterService = {
  async subscribe(subscription: NewNewsletterSubscription): Promise<NewsletterSubscription> {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        ...subscription,
        subscribed_at: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async isSubscribed(email: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('id')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  async unsubscribe(email: string): Promise<void> {
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) throw error;
  },

  async getAll(): Promise<NewsletterSubscription[]> {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// Bulk Order Service
export const bulkOrderService = {
  async create(order: NewBulkOrder): Promise<BulkOrder> {
    const { data, error } = await supabase
      .from('bulk_orders')
      .insert({
        ...order,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(): Promise<BulkOrder[]> {
    const { data, error } = await supabase
      .from('bulk_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateStatus(id: number, status: BulkOrder['status']): Promise<BulkOrder> {
    const { data, error } = await supabase
      .from('bulk_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Order Service
export const orderService = {
  async getUserOrders(identifier: string): Promise<any[]> {
    try {
      console.log('Directly querying orders table with strict matching on identifier:', identifier);
      
      const isPhone = /^[0-9+\s\-()]+$/.test(identifier) && identifier.length >= 10;
      const column = isPhone ? 'customer_phone' : 'customer_email';
      
      // We use a raw fetch request here because the Supabase JS client could hang 
      // indefinitely if the user's local auth session state is stuck refreshing a bad token
      // in the background. MyOrders doesn't need auth state; it matches by email/phone.
      const url = new URL(`${SUPABASE_URL}/rest/v1/orders`);
      url.searchParams.append(column, `eq.${identifier}`);
      url.searchParams.append('order', 'created_at.desc');
      
      console.log('Sending optimized fetch query to:', url.toString());
      const response = await fetch(url.toString(), {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Order fetching database error:', errText);
        throw new Error(errText);
      }
      
      const data = await response.json();
      console.log('Optimized query results length:', data?.length);
      
      return data || [];
    } catch (error) {
      console.error('Error in getUserOrders:', error);
      throw error;
    }
  },

  async createOrder(orderData: any): Promise<any> {
    try {
      const url = new URL(`${SUPABASE_URL}/rest/v1/orders`);
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Error creating order in DB:', errText);
        throw new Error(errText);
      }

      const data = await response.json();
      // Since 'Prefer': 'return=representation' is used, it returns an array of inserted records.
      return data[0];
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    try {
      const url = new URL(`${SUPABASE_URL}/rest/v1/orders`);
      url.searchParams.append('order_id', `eq.${orderId}`);
      
      const response = await fetch(url.toString(), {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Error updating order status:', errText);
      }
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
    }
  }
};
