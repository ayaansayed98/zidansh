import React, { useState, useEffect } from 'react';
import { CustomerList } from './CustomerList';
import { CustomerForm } from './CustomerForm';
import { BulkOrderModal } from './BulkOrderModal';
import { analyticsService } from '../lib/analytics';
import { customerService, bulkOrderService } from '../lib/database';
import { Customer } from '../types/customer';
import { BulkOrder } from '../types/bulkOrder';
import { Plus, Users, Package } from 'lucide-react';

export const CustomerManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'bulk-orders'>('customers');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showBulkOrderModal, setShowBulkOrderModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCustomerAdded = (customer: any) => {
    setShowCustomerForm(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBulkOrderAdded = () => {
    setShowBulkOrderModal(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [customersData, bulkOrdersData] = await Promise.all([
        customerService.getAll(),
        bulkOrderService.getAll()
      ]);
      setCustomers(customersData);
      setBulkOrders(bulkOrdersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
          <p className="text-gray-600">Manage your customers and bulk orders</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'customers'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Customers ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab('bulk-orders')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'bulk-orders'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-5 h-5 inline mr-2" />
              Bulk Orders ({bulkOrders.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'customers' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Customer List</h2>
              <button
                onClick={() => setShowCustomerForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Customer
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading customers...</p>
              </div>
            ) : (
              <CustomerList refreshTrigger={refreshTrigger} />
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Bulk Orders</h2>
              <button
                onClick={() => setShowBulkOrderModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Bulk Order
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading bulk orders...</p>
              </div>
            ) : bulkOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bulk orders yet</h3>
                <p className="text-gray-500 mb-4">Create your first bulk order to get started</p>
                <button
                  onClick={() => setShowBulkOrderModal(true)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Bulk Order
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bulkOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.type}</h3>
                        <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                        {order.details && <p className="text-sm text-gray-600 mt-1">{order.details}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 capitalize">{order.status}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCustomerForm && (
        <CustomerForm
          onCustomerAdded={handleCustomerAdded}
        />
      )}

      {showBulkOrderModal && (
        <BulkOrderModal
          isOpen={showBulkOrderModal}
          onClose={() => setShowBulkOrderModal(false)}
          onSubmit={handleBulkOrderAdded}
        />
      )}
    </div>
  );
};
