export interface NewsletterSubscription {
  id: number;
  email: string;
  subscription_source: string;
  user_agent?: string;
  ip_address?: string;
  subscribed_at: string;
  unsubscribed_at?: string;
  is_active: boolean;
}

export interface NewNewsletterSubscription {
  email: string;
  subscription_source: string;
  user_agent?: string;
  ip_address?: string;
}
