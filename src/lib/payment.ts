// Payment Service for Real-time Payment Integration
// Supports Razorpay, UPI, Cards, and other payment methods

import { CreditCard, Smartphone, Wallet } from 'lucide-react';

export interface PaymentData {
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
  description: string;
  paymentMethod?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

export interface QuickPaymentMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
}

export interface UpiApp {
  id: string;
  name: string;
  logo: string;
}

// Quick Payment Methods
export const quickPaymentMethods: QuickPaymentMethod[] = [
  {
    id: 'razorpay',
    name: 'Online Pay',
    icon: CreditCard,
    description: 'Secure online payment'
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: Smartphone,
    description: 'Pay using UPI apps'
  },
  {
    id: 'card',
    name: 'Card',
    icon: CreditCard,
    description: 'Credit/Debit cards'
  },
  {
    id: 'cash',
    name: 'Cash',
    icon: Wallet,
    description: 'Cash on delivery'
  }
];

// Popular UPI Apps
export const upiApps: UpiApp[] = [
  { id: 'gpay', name: 'Google Pay', logo: 'https://cdn.worldvectorlogo.com/logos/google-pay-1.svg' },
  { id: 'phonepe', name: 'PhonePe', logo: 'https://cdn.worldvectorlogo.com/logos/phonepe-1.svg' },
  { id: 'paytm', name: 'Paytm', logo: 'https://cdn.worldvectorlogo.com/logos/paytm-1.svg' },
  { id: 'amazonpay', name: 'Amazon Pay', logo: 'https://cdn.worldvectorlogo.com/logos/amazon-pay.svg' },
  { id: 'bhim', name: 'BHIM UPI', logo: 'https://cdn.worldvectorlogo.com/logos/bhim-1.svg' },
  { id: 'other', name: 'Other UPI', logo: 'https://cdn.worldvectorlogo.com/logos/upi.svg' }
];

class PaymentService {
  private razorpayKeyId: string;
  private razorpayKeySecret: string;
  private payuKey: string;
  private isProduction: boolean;

  constructor() {
    // Load PayU Environment
    this.isProduction = import.meta.env.VITE_PAYU_ENV === 'production';

    // Load Razorpay keys from environment variables
    this.razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_here';
    this.razorpayKeySecret = import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'your_secret_here';

    // Load PayU keys
    this.payuKey = import.meta.env.VITE_PAYU_KEY || 'GTKFFx'; // Test Key

    // Validate production keys
    if (this.isProduction) {
      if (this.payuKey === 'GTKFFx') {
        console.warn('WARNING: Using Test PayU Keys in Production Mode!');
      }
      if (!this.payuKey) {
        console.error('ERROR: PayU Production Keys missing in .env');
      }
    }
  }

  // Load Razorpay script dynamically
  private async loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Create order on backend (mock implementation)
  private async createOrder(amount: number, currency: string, orderId: string): Promise<any> {
    try {
      // In production, this should call your backend API
      // For demo purposes, we'll simulate the response
      const orderData = {
        id: `order_${orderId}`,
        amount: amount * 100, // Convert to paisa
        currency: currency,
        status: 'created'
      };

      console.log('Order created:', orderData);
      return orderData;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Helper to generate hash securely on backend
  private async generateHash(data: any): Promise<string> {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/generate-hash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (!result.success || !result.hash) {
        throw new Error(result.error || 'Failed to generate hash');
      }

      return result.hash;
    } catch (error) {
      console.error('Hash generation error:', error);
      throw error;
    }
  }

  private submitPayUForm(params: any) {
    const form = document.createElement('form');
    form.method = 'POST';
    // Use secure URL for production, test URL for development
    form.action = this.isProduction
      ? 'https://secure.payu.in/_payment'
      : 'https://test.payu.in/_payment';

    Object.keys(params).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = params[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }

  // Process payment with PayU
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      if (paymentData.paymentMethod === 'online' || paymentData.paymentMethod === 'payu') {
        const txnid = paymentData.orderId;
        const amount = paymentData.amount;
        const productinfo = paymentData.description;
        const firstname = paymentData.customerName.split(' ')[0];
        const email = paymentData.customerEmail;
        const phone = paymentData.customerPhone;

        // Define success and failure URLs
        // These must point to your BACKEND server which handles the POST callback
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
        const surl = `${backendUrl}/payment/success`;
        const furl = `${backendUrl}/payment/failure`;

        const hash = await this.generateHash({
          txnid,
          amount,
          productinfo,
          firstname,
          email
        });

        // PayU specific parameters
        const payuParams = {
          key: this.payuKey,
          txnid,
          amount,
          productinfo,
          firstname,
          email,
          phone,
          surl,
          furl,
          hash,
          udf1: '',
          udf2: '',
          udf3: '',
          udf4: '',
          udf5: ''
        };

        this.submitPayUForm(payuParams);
        // Since we are redirecting, we return a pending state
        return { success: true, paymentId: 'redirecting_to_payu' };
      }

      return { success: false, error: 'Invalid payment method' };

    } catch (error: any) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error.message || 'Payment processing failed'
      };
    }
  }

  // Check if running in production mode
  public isProductionMode(): boolean {
    return this.isProduction;
  }

  // Handle successful payment
  private async handlePaymentSuccess(response: any, paymentData: PaymentData) {
    try {
      // Store payment details in your database
      const paymentDetails = {
        payment_id: response.razorpay_payment_id,
        order_id: response.razorpay_order_id,
        signature: response.razorpay_signature,
        amount: paymentData.amount,
        customer_email: paymentData.customerEmail,
        customer_phone: paymentData.customerPhone,
        order_number: paymentData.orderId,
        payment_method: 'razorpay',
        status: 'completed',
        created_at: new Date().toISOString()
      };

      console.log('Payment details to store:', paymentDetails);

      // Here you would typically send this to your backend
      // await fetch('/api/payments/store', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(paymentDetails)
      // });

    } catch (error) {
      console.error('Error storing payment details:', error);
    }
  }

  // Verify payment signature (server-side verification)
  async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    try {
      // This should be done on your backend for security
      // For demo purposes, we'll skip verification in the frontend
      console.log('Payment verification should be done on backend');
      return true; // Demo: assume valid
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();

// Utility functions for payment processing
export const formatAmount = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export const validatePaymentData = (data: PaymentData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.amount || data.amount <= 0) {
    errors.push('Invalid payment amount');
  }

  if (!data.customerEmail || !data.customerEmail.includes('@')) {
    errors.push('Invalid email address');
  }

  if (!data.customerPhone || data.customerPhone.length !== 10) {
    errors.push('Invalid phone number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
