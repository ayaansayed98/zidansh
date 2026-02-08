// Validation utilities for forms

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormSchema {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
    custom?: (value: any, formData?: any) => string | null;
  };
}

export const FORM_SCHEMAS: Record<string, FormSchema> = {
  signUp: {
    username: {
      required: true,
      minLength: 3,
      pattern: /^[a-zA-Z0-9_]+$/,
      custom: (value: string) => {
        if (value && value.length < 3) {
          return 'Username must be at least 3 characters long';
        }
        if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
          return 'Username can only contain letters, numbers, and underscores';
        }
        return null;
      }
    },
    phone_number: {
      required: true,
      pattern: /^[6-9]\d{9}$/,
      custom: (value: string) => {
        if (value && !/^[6-9]\d{9}$/.test(value)) {
          return 'Please enter a valid 10-digit mobile number starting with 6-9';
        }
        return null;
      }
    },
    password: {
      required: true,
      minLength: 6,
      custom: (value: string) => {
        if (value && value.length < 6) {
          return 'Password must be at least 6 characters long';
        }
        return null;
      }
    },
    confirmPassword: {
      required: true,
      custom: (value: string, formData?: any) => {
        if (value && formData?.password && value !== formData.password) {
          return 'Passwords do not match';
        }
        return null;
      }
    }
  },
  signIn: {
    phone_number: {
      required: true,
      pattern: /^[6-9]\d{9}$/,
      custom: (value: string) => {
        if (value && !/^[6-9]\d{9}$/.test(value)) {
          return 'Please enter a valid 10-digit mobile number';
        }
        return null;
      }
    },
    password: {
      required: true,
      custom: (value: string) => {
        if (!value || value.trim() === '') {
          return 'Password is required';
        }
        return null;
      }
    }
  },
  signInOtp: {
    phone_number: {
      required: true,
      pattern: /^[6-9]\d{9}$/,
      custom: (value: string) => {
        if (value && !/^[6-9]\d{9}$/.test(value)) {
          return 'Please enter a valid 10-digit mobile number';
        }
        return null;
      }
    },
    otp: {
      required: true,
      pattern: /^\d{6}$/,
      custom: (value: string) => {
        if (!value || !/^\d{6}$/.test(value)) {
          return 'Please enter a valid 6-digit OTP';
        }
        return null;
      }
    }
  },
  bulkOrder: {
    type: {
      required: true,
      custom: (value: string) => {
        if (!value || value.trim() === '') {
          return 'Please select a clothing type';
        }
        return null;
      }
    },
    quantity: {
      required: true,
      custom: (value: string) => {
        const num = parseInt(value);
        if (!value || isNaN(num) || num < 1) {
          return 'Please enter a valid quantity (minimum 1)';
        }
        return null;
      }
    }
  },
  checkout: {
    customerName: {
      required: true,
      minLength: 2,
      custom: (value: string) => {
        if (!value || value.trim().length < 2) {
          return 'Please enter a valid name (minimum 2 characters)';
        }
        return null;
      }
    },
    customerEmail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value: string) => {
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return null;
      }
    },
    customerPhone: {
      required: true,
      pattern: /^(\+?91|0)?[6-9]\d{9}$/,
      custom: (value: string) => {
        // Remove spaces, dashes, +, and leading 0/91
        const cleanNumber = value.replace(/[\s\-\+]/g, '').replace(/^(0|91)/, '');
        if (!value || !/^[6-9]\d{9}$/.test(cleanNumber)) {
          return 'Please enter a valid 10-digit mobile number';
        }
        return null;
      }
    },
    address: {
      required: true,
      minLength: 10,
      custom: (value: string) => {
        if (!value || value.trim().length < 10) {
          return 'Please enter a complete address (minimum 10 characters)';
        }
        return null;
      }
    },
    city: {
      required: true,
      minLength: 2,
      custom: (value: string) => {
        if (!value || value.trim().length < 2) {
          return 'Please enter a valid city name';
        }
        return null;
      }
    },
    state: {
      required: true,
      minLength: 2,
      custom: (value: string) => {
        if (!value || value.trim().length < 2) {
          return 'Please enter a valid state name';
        }
        return null;
      }
    },
    pincode: {
      required: true,
      pattern: /^[1-9]\d{5}$/,
      custom: (value: string) => {
        if (!value || !/^[1-9]\d{5}$/.test(value)) {
          return 'Please enter a valid 6-digit pincode';
        }
        return null;
      }
    },
    paymentMethod: {
      required: true,
      custom: (value: string) => {
        if (!value) {
          return 'Please select a payment method';
        }
        return null;
      }
    }
  },
  trackOrder: {
    orderId: {
      required: true,
      minLength: 3,
      custom: (value: string) => {
        if (!value || value.trim().length < 3) {
          return 'Please enter a valid Order ID';
        }
        return null;
      }
    }
  },
  customer: {
    phone_number: {
      required: true,
      pattern: /^\+?[\d\s-]{10,}$/,
      custom: (value: string) => {
        if (!value || !/^\+?[\d\s-]{10,}$/.test(value)) {
          return 'Please enter a valid phone number';
        }
        return null;
      }
    },
    email_address: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value: string) => {
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return null;
      }
    },
    order_number: {
      required: true,
      minLength: 3
    },
    type_of_clothes: {
      required: true
    },
    quantity: {
      required: true,
      custom: (value: any) => {
        if (Number(value) < 1) {
          return 'Quantity must be at least 1';
        }
        return null;
      }
    },
    payment_amount: {
      required: true,
      custom: (value: any) => {
        if (Number(value) < 0) {
          return 'Amount cannot be negative';
        }
        return null;
      }
    }
  }
};

export function validateForm(data: Record<string, any>, schema: FormSchema): ValidationResult {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Check required
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors[field] = `${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`;
      isValid = false;
      continue;
    }

    // Skip other validations if field is empty and not required
    if (!value && !rules.required) {
      continue;
    }

    // Check minLength
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      errors[field] = `${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} must be at least ${rules.minLength} characters long`;
      isValid = false;
      continue;
    }

    // Check pattern
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      errors[field] = `Please enter a valid ${field.replace('_', ' ')}`;
      isValid = false;
      continue;
    }

    // Check custom validation
    if (rules.custom) {
      const customError = rules.custom(value, data);
      if (customError) {
        errors[field] = customError;
        isValid = false;
        continue;
      }
    }
  }

  return { isValid, errors };
}

// Utility function to validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility function to validate phone number
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}
