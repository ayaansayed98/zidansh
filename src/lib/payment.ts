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

  constructor() {
    // Load Razorpay keys from environment variables
    this.razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_here';
    this.razorpayKeySecret = import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'your_secret_here';
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

  // Process payment with Razorpay
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      // Load Razorpay script
      const scriptLoaded = await this.loadRazorpayScript();
      if (!scriptLoaded) {
        return { success: false, error: 'Failed to load payment gateway' };
      }

      // Create order
      const order = await this.createOrder(paymentData.amount, paymentData.currency, paymentData.orderId);

      // Razorpay options
      const options = {
        key: this.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Zidansh Fashion',
        description: paymentData.description,
        order_id: order.id,
        prefill: {
          name: paymentData.customerName,
          email: paymentData.customerEmail,
          contact: paymentData.customerPhone
        },
        theme: {
          color: '#ec4899' // Pink theme to match your brand
        },
        handler: (response: any) => {
          console.log('Payment successful:', response);
          // Handle successful payment
          this.handlePaymentSuccess(response, paymentData);
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
            // Handle payment cancellation
          }
        }
      };

      // Open Razorpay checkout
      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();

      // Return promise that resolves when payment is complete
      return new Promise((resolve) => {
        razorpayInstance.on('payment.success', (response: any) => {
          resolve({ success: true, paymentId: response.razorpay_payment_id });
        });

        razorpayInstance.on('payment.error', (error: any) => {
          resolve({ success: false, error: error.description });
        });
      });

    } catch (error) {
      console.error('Payment processing error:', error);
      return { success: false, error: 'Payment processing failed' };
    }
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
