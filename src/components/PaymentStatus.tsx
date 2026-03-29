import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Package, Calendar, CreditCard, ChevronRight, Home } from 'lucide-react';
import { inventoryService } from '../lib/inventory';
import { loadCartItems, saveCartItems } from '../lib/storage';
import { orderService } from '../lib/database';

const PaymentStatus: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'success' | 'failure' | 'loading'>('loading');
    const [processed, setProcessed] = useState(false);

    const searchParams = new URLSearchParams(location.search);
    const amount = searchParams.get('amount') || searchParams.get('total') || '0.00';
    const orderId = searchParams.get('orderId') || searchParams.get('txnid') || 'Unknown';
    const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
    });

    useEffect(() => {
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

                            const orderId = searchParams.get('orderId') || searchParams.get('txnid');
                            if (orderId) {
                                await orderService.updateOrderStatus(orderId, 'processing');
                                console.log('Order status updated to processing.');
                            }

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

        } else if (location.pathname.includes('/failure')) {
            setStatus('failure');
            const orderId = searchParams.get('orderId') || searchParams.get('txnid');
            if (orderId && !processed) {
                setProcessed(true);
                orderService.updateOrderStatus(orderId, 'cancelled').catch(console.error);
            }
        } else {
            setStatus('failure');
        }
    }, [location, navigate, processed]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full transform transition-all">
                {status === 'success' ? (
                    <div className="space-y-6 text-center">
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="absolute -inset-1 rounded-full bg-green-100 animate-ping"></div>
                                <CheckCircle className="relative w-24 h-24 text-green-500 bg-white rounded-full z-10" />
                            </div>
                        </div>
                        
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Payment Successful!</h2>
                            <p className="text-gray-500">
                                Thank you for your purchase. We are preparing your order.
                            </p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-5 mt-6 border border-gray-100 text-left space-y-4 shadow-sm">
                            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-2 flex items-center gap-2">
                                <Package className="w-5 h-5 text-pink-600" />
                                Order Details
                            </h3>
                            
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Order ID:</span>
                                <span className="font-medium font-mono bg-white px-2 py-1 rounded shadow-sm text-gray-800">{orderId}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 flex items-center gap-1"><CreditCard className="w-4 h-4"/> Amount Paid:</span>
                                <span className="font-bold text-gray-900 text-lg">₹{amount}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm bg-blue-50 -mx-5 -mb-5 p-5 rounded-b-xl border-t border-blue-100 mt-4">
                                <span className="text-blue-800 flex items-center gap-1 font-medium"><Calendar className="w-4 h-4" /> Expected Delivery:</span>
                                <span className="font-bold text-blue-900 text-right">{deliveryDate}</span>
                            </div>
                        </div>

                        <div className="pt-6 space-y-3 flex flex-col sm:flex-row sm:space-y-0 sm:gap-3">
                            <Link
                                to="/orders"
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-black text-white font-medium rounded-xl hover:bg-gray-900 hover:shadow-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-black"
                            >
                                Track Order <ChevronRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/"
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                            >
                                <Home className="w-4 h-4" /> Home
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
