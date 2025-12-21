import React, { useState } from 'react';
import { X } from 'lucide-react';
import { bulkOrderService } from '../lib/database';
import { validateForm, FORM_SCHEMAS } from '../lib/validation';

interface BulkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: { type: string; quantity: number; details: string }) => void;
}

export const BulkOrderModal: React.FC<BulkOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<{ type?: string; quantity?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form using the new validation system
    const formData = { type, quantity };
    const validation = validateForm(formData, FORM_SCHEMAS.bulkOrder);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage('');

      // Save to database using the service
      await bulkOrderService.create({
        type,
        quantity: parseInt(quantity),
        details: details.trim() || undefined
      });

      // Submit the form (for any additional handling)
      onSubmit({
        type,
        quantity: parseInt(quantity),
        details: details.trim()
      });

      setSubmitMessage('Bulk order submitted successfully!');
      // Reset form
      setType('');
      setQuantity('');
      setDetails('');
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error submitting bulk order:', error);
      setSubmitMessage('Failed to submit bulk order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Bulk Order Inquiry</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Clothing Type *
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="" className="text-gray-900">Select a type</option>
              <option value="T-Shirts" className="text-gray-900">T-Shirts</option>
              <option value="Shirts" className="text-gray-900">Shirts</option>
              <option value="Pants" className="text-gray-900">Pants</option>
              <option value="Kurta" className="text-gray-900">Kurta</option>
              <option value="Suits" className="text-gray-900">Suits</option>
              <option value="Other" className="text-gray-900">Other</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              placeholder="Enter quantity"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Details
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Any specific requirements, sizes, colors, etc."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
            />
          </div>

          {submitMessage && (
            <div className={`p-3 rounded-md ${submitMessage.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {submitMessage}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
