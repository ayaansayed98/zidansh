export interface User {
  id: string;
  username: string;
  phone_number?: string;
  password_hash?: string;
  email_address?: string;
  is_verified: boolean;
  verification_token?: string;
  otp_code?: string;
  otp_expires_at?: string;
  last_signin_at?: string;
  signin_count: number;
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
  updated_at: string;
}

export interface NewUser {
  username: string;
  phone_number?: string;
  password_hash?: string;
  email_address?: string;
}

export interface SignInAttempt {
  id: string;
  phone_number: string;
  attempted_at: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  success: boolean;
  failure_reason?: string;
  created_at: string;
}

export interface OrderTrackingRequest {
  id: string;
  order_number: string;
  phone_number?: string;
  email_address?: string;
  requested_at: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  status: 'requested' | 'found' | 'not_found' | 'error';
  response_message?: string;
  created_at: string;
}
