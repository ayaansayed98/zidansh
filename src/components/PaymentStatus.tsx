import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { inventoryService } from '../lib/inventory';
import { loadCartItems, saveCartItems } from '../lib/storage';

const PaymentStatus: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'success' | 'failure' | 'loading'>('loading');
    const [processed, setProcessed] = useState(false);

    useEffect(() => {
        // Log all URL parameters for debugging
        const searchParams = new URLSearchParams(location.search);
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });
        console.log('Payment Return Params:', params);

        // Check path to determine status
        const statusParam = searchParams.get('status');

        if (location.pathname.includes('/success') || statusParam === 'success' || statusParam === 'pending') {
            setStatus('success');

            // Handle post-payment logic: Deduct Stock & Clear Cart
            // Only run this once per mount
            if (!processed) {
                setProcessed(true);
                const handleSuccess = async () => {
                    try {
                        const cartItems = loadCartItems();
                        if (cartItems.length > 0) {
                            console.log('Processing successful payment stock deduction');
                            // Convert storage items to inventory items (match interface)
                            await inventoryService.updateStock(cartItems.map(item => ({
                                id: item.cartItemId,
                                productId: item.productId,
                                quantity: item.quantity,
                                size: item.size,
                                name: item.name
                            })));

                            // Clear cart
                            saveCartItems([]);
                            // Dispatch custom event to notify App.tsx to reload cart
                            window.dispatchEvent(new Event('cartUpdated'));
                            // Also standard storage event for cross-tab
                            window.dispatchEvent(new Event('storage'));
                        }
                    } catch (e) {
                        console.error('Post-payment processing failed:', e);
                    }
                };
                handleSuccess();
            }

            // Redirect to orders
            const timer = setTimeout(() => {
                navigate('/orders');
            }, 3000);
            return () => clearTimeout(timer);

        } else if (location.pathname.includes('/failure')) {
            setStatus('failure');
        } else {
            setStatus('failure');
        }
    }, [location, navigate, processed]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                {status === 'success' ? (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
                        <p className="text-gray-600">
                            Thank you for your purchase. Your order has been placed successfully.
                        </p>
                        <p className="text-sm text-gray-500">
                            Redirecting to your orders...
                        </p>
                        <div className="pt-6 space-y-3">
                            <Link
                                to="/profile"
                                className="block w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                            >
                                View Orders Now
                            </Link>
                            <Link
                                to="/"
                                className="block w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <XCircle className="w-16 h-16 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
                        <p className="text-gray-600">
                            We couldn't process your payment. Please try again or use a different payment method.
                        </p>
                        {/* Display specific error if available from URL params */}
                        {new URLSearchParams(location.search).get('error_Message') && (
                            <p className="text-red-500 text-sm bg-red-50 p-2 rounded">
                                Reason: {new URLSearchParams(location.search).get('error_Message')}
                            </p>
                        )}
                        <div className="pt-6 space-y-3">
                            <Link
                                to="/checkout"
                                className="block w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                            >
                                Try Again
                            </Link>
                            <Link
                                to="/"
                                className="block w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Return Home
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentStatus;
