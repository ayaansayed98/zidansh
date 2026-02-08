import { useEffect, useState } from 'react';
import { Clock, CheckCircle, Truck, XCircle, Package } from 'lucide-react';
import { orderService } from '../lib/database';

interface MyOrdersProps {
    user: any;
}

function MyOrders({ user }: MyOrdersProps) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.email) return;

            try {
                setLoading(true);
                const data = await orderService.getUserOrders(user.email);
                setOrders(data);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-600">
                {error}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">😢</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet!!!</h3>
                <p className="text-gray-500 mb-6">Start shopping to fill your bag with happiness.</p>
                <a href="/" className="inline-block bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition">
                    Start Shopping
                </a>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing': return 'text-blue-600 bg-blue-50';
            case 'shipped': return 'text-purple-600 bg-purple-50';
            case 'delivered': return 'text-green-600 bg-green-50';
            case 'cancelled': return 'text-red-600 bg-red-50';
            default: return 'text-yellow-600 bg-yellow-50';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'processing': return Clock;
            case 'shipped': return Truck;
            case 'delivered': return CheckCircle;
            case 'cancelled': return XCircle;
            default: return Package;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>

            {orders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                const items = order.items || []; // items are stored as JSONB

                return (
                    <div key={order.id} className="bg-white border text-left border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* Order Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Order Placed</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="font-medium text-gray-900">₹{order.amount}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Order ID</p>
                                <p className="font-medium text-gray-900">#{order.order_id}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                <StatusIcon className="w-4 h-4" />
                                <span className="capitalize">{order.status}</span>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6">
                            <div className="space-y-6">
                                {items.map((item: any, index: number) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image || '/zidansh img/realimg/img1.jpg'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAyMEgzOFYyMEgzOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-medium text-gray-900 truncate">{item.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 mt-1">₹{item.price * item.quantity}</p>
                                        </div>
                                        <div className="self-center">
                                            <button className="text-pink-600 hover:text-pink-700 text-sm font-medium hover:underline">
                                                Write Review
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Footer - could add action buttons here like "Track Order" or "Invoice" */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="text-sm text-gray-500">
                                Payment Method: <span className="text-gray-900 font-medium capitalize">{order.payment_method}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default MyOrders;
