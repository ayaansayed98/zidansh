import { useState } from 'react';
import { userService } from '../lib/database';
import { OrderTrackingRequest } from '../types/user';
import { validateForm, FORM_SCHEMAS } from '../lib/validation';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrack: (orderId: string) => void;
}

export function TrackOrderModal({ isOpen, onClose, onTrack }: TrackOrderModalProps) {
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedOrderId = orderId.trim();

    // Validation
    const validation = validateForm({ orderId: normalizedOrderId }, FORM_SCHEMAS.trackOrder);
    if (!validation.isValid) {
      setError(validation.errors.orderId);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // In a real application, you would fetch the order status here
      // For now, we'll simulate a successful request
      const orderRequest: OrderTrackingRequest = {
        id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order_number: normalizedOrderId,
        requested_at: new Date().toISOString(),
        ip_address: '', // In a real app, you'd get this from the request
        user_agent: navigator.userAgent,
        session_id: localStorage.getItem('userSession') || '',
        status: 'requested',
        response_message: 'Order tracking requested',
        created_at: new Date().toISOString()
      };

      try {
        // Try to save the tracking request if userService is available
        if (userService?.trackOrderTrackingRequest) {
          await userService.trackOrderTrackingRequest(orderRequest);
        }
      } catch (dbError) {
        console.error('Error saving tracking request:', dbError);
        // Don't fail the whole process if tracking fails
      }

      // Show order status to user
      const orderStatus = {
        status: 'Processing',
        estimatedDelivery: 'December 20, 2023',
        items: [
          { name: 'Product 1', quantity: 1, status: 'Shipped' },
          { name: 'Product 2', quantity: 2, status: 'Processing' }
        ],
        trackingNumber: 'TRK' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
      };

      alert(
        `Order #${normalizedOrderId}\n` +
        `Status: ${orderStatus.status}\n` +
        `Estimated Delivery: ${orderStatus.estimatedDelivery}\n` +
        `Tracking #: ${orderStatus.trackingNumber}\n\n` +
        `Items:\n` +
        orderStatus.items.map(item => `- ${item.name} (Qty: ${item.quantity}): ${item.status}`).join('\n')
      );

      onTrack(normalizedOrderId);
      setOrderId('');
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Failed to track order. Please check your order ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Track Your Order</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              placeholder="Enter your order ID"
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${isLoading
                ? 'bg-purple-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
                }`}
            >
              {isLoading ? 'Processing...' : 'Track Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
