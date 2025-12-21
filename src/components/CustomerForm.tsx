import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Customer, NewCustomer } from '../types/customer';
import { customerService } from '../lib/database';
import { validateForm, FORM_SCHEMAS } from '../lib/validation';

interface CustomerFormProps {
  onCustomerAdded: (customer: Customer) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ onCustomerAdded }) => {
  const [formData, setFormData] = useState<NewCustomer>({
    phone_number: '',
    email_address: '',
    order_number: '',
    type_of_clothes: '',
    quantity: 1,
    payment_amount: 0,
    type_of_payment: 'cash'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const validation = validateForm(formData, FORM_SCHEMAS.customer);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const newCustomer = await customerService.create(formData);
      onCustomerAdded(newCustomer);
      setFormData({
        phone_number: '',
        email_address: '',
        order_number: '',
        type_of_clothes: '',
        quantity: 1,
        payment_amount: 0,
        type_of_payment: 'cash'
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Error creating customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'payment_amount' ? Number(value) : value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Add New Customer
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1234567890"
            />
            {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email_address"
              value={formData.email_address}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="customer@example.com"
            />
            {errors.email_address && <p className="text-red-500 text-xs mt-1">{errors.email_address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Order Number</label>
            <input
              type="text"
              name="order_number"
              value={formData.order_number}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ORD-001"
            />
            {errors.order_number && <p className="text-red-500 text-xs mt-1">{errors.order_number}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type of Clothes</label>
            <input
              type="text"
              name="type_of_clothes"
              value={formData.type_of_clothes}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Shirt, Pants, Dress..."
            />
            {errors.type_of_clothes && <p className="text-red-500 text-xs mt-1">{errors.type_of_clothes}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Amount ($)</label>
            <input
              type="number"
              name="payment_amount"
              value={formData.payment_amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
            {errors.payment_amount && <p className="text-red-500 text-xs mt-1">{errors.payment_amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Type</label>
            <select
              name="type_of_payment"
              value={formData.type_of_payment}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isSubmitting ? 'Adding Customer...' : 'Add Customer'}
        </button>
      </form>
    </div>
  );
};
