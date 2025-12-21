import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, MousePointer, Clock, ShoppingCart, Eye, DollarSign } from 'lucide-react';
import { analyticsService } from '../lib/analytics';
import { supabase } from '../lib/supabase';

const DASHBOARD_PASSWORD = 'Ayaan98!';

interface DashboardStats {
  totalClicks: number;
  totalOrders: number;
  totalRevenue: number;
  uniqueVisitors: number;
  topButtons: Array<{ button_name: string; count: number }>;
  topProductCartButtons: Array<{ button_name: string; count: number }>;
  topProducts: Array<{ product_name: string; sales: number; revenue: number }>;
  topFavoritedProducts: Array<{ product_name: string; count: number }>;
  topCheckedOutProducts: Array<{ product_name: string; count: number }>;
  trafficByHour: Array<{ hour: number; visits: number }>;
  deviceBreakdown: Array<{ device_type: string; count: number }>;
  peakHours: Array<{ hour: string; visits: number }>;
}

const Dashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalClicks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    uniqueVisitors: 0,
    topButtons: [],
    topProductCartButtons: [],
    topProducts: [],
    topFavoritedProducts: [],
    topCheckedOutProducts: [],
    trafficByHour: [],
    deviceBreakdown: [],
    peakHours: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [timeRange, isAuthenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DASHBOARD_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const now = new Date();
      const startDate = new Date();
      switch (timeRange) {
        case '24h':
          startDate.setHours(now.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
      }

      // Fetch button clicks data
      const { data: buttonClicks, error: clicksError } = await supabase
        .from('button_clicks')
        .select('button_name, timestamp')
        .gte('timestamp', startDate.toISOString());

      if (clicksError) console.error('Error fetching button clicks:', clicksError);

      // Fetch checkout data for sales
      const checkoutData = await analyticsService.getCheckoutData();

      // Fetch product interactions for favorites
      const { data: productInteractions, error: interactionsError } = await supabase
        .from('product_interactions')
        .select('product_name, interaction_type')
        .gte('created_at', startDate.toISOString());

      if (interactionsError) console.error('Error fetching product interactions:', interactionsError);

      // Fetch traffic data
      const { data: trafficData, error: trafficError } = await supabase
        .from('traffic_analytics_extended')
        .select('timestamp, device_type, user_session')
        .gte('timestamp', startDate.toISOString());

      if (trafficError) console.error('Error fetching traffic data:', trafficError);

      // Process button clicks
      const buttonCountMap = new Map<string, number>();
      (buttonClicks || []).forEach(click => {
        const count = buttonCountMap.get(click.button_name) || 0;
        buttonCountMap.set(click.button_name, count + 1);
      });

      const topButtons = Array.from(buttonCountMap.entries())
        .map(([button_name, count]) => ({ button_name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Process product cart button clicks (filter buttons that contain "Add to Cart" or similar)
      const productCartButtonMap = new Map<string, number>();
      (buttonClicks || []).forEach(click => {
        if (click.button_name.toLowerCase().includes('add to cart') ||
          click.button_name.toLowerCase().includes('cart') ||
          click.button_name.toLowerCase().includes('buy now')) {
          const count = productCartButtonMap.get(click.button_name) || 0;
          productCartButtonMap.set(click.button_name, count + 1);
        }
      });

      const topProductCartButtons = Array.from(productCartButtonMap.entries())
        .map(([button_name, count]) => ({ button_name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Process sales data
      const productSalesMap = new Map<string, { sales: number; revenue: number }>();
      checkoutData.forEach(order => {
        order.cart_items.forEach(item => {
          const existing = productSalesMap.get(item.product_name) || { sales: 0, revenue: 0 };
          productSalesMap.set(item.product_name, {
            sales: existing.sales + item.quantity,
            revenue: existing.revenue + (item.product_price * item.quantity)
          });
        });
      });

      const topProducts = Array.from(productSalesMap.entries())
        .map(([product_name, data]) => ({ product_name, ...data }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 10);

      // Process favorite products data
      const favoriteProductsMap = new Map<string, number>();
      (productInteractions || []).forEach(interaction => {
        if (interaction.interaction_type === 'wishlist_add') {
          const count = favoriteProductsMap.get(interaction.product_name) || 0;
          favoriteProductsMap.set(interaction.product_name, count + 1);
        }
      });

      const topFavoritedProducts = Array.from(favoriteProductsMap.entries())
        .map(([product_name, count]) => ({ product_name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Process checkout products data (products that were actually purchased)
      const checkoutProductsMap = new Map<string, number>();
      checkoutData.forEach(order => {
        order.cart_items.forEach(item => {
          const count = checkoutProductsMap.get(item.product_name) || 0;
          checkoutProductsMap.set(item.product_name, count + item.quantity);
        });
      });

      const topCheckedOutProducts = Array.from(checkoutProductsMap.entries())
        .map(([product_name, count]) => ({ product_name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Process traffic data
      const hourTrafficMap = new Map<number, number>();
      const deviceMap = new Map<string, number>();
      const uniqueSessions = new Set<string>();

      (trafficData || []).forEach(visit => {
        // Hourly traffic
        const hour = new Date(visit.timestamp).getHours();
        hourTrafficMap.set(hour, (hourTrafficMap.get(hour) || 0) + 1);

        // Device breakdown
        deviceMap.set(visit.device_type, (deviceMap.get(visit.device_type) || 0) + 1);

        // Unique visitors
        uniqueSessions.add(visit.user_session);
      });

      const trafficByHour = Array.from(hourTrafficMap.entries())
        .map(([hour, visits]) => ({ hour, visits }))
        .sort((a, b) => a.hour - b.hour);

      const deviceBreakdown = Array.from(deviceMap.entries())
        .map(([device_type, count]) => ({ device_type, count }));

      // Calculate peak hours
      const peakHours = trafficByHour
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 5)
        .map(item => ({
          hour: `${item.hour}:00`,
          visits: item.visits
        }));

      // Calculate totals
      const totalRevenue = checkoutData.reduce((sum, order) => sum + order.total_amount, 0);
      const totalOrders = checkoutData.length;

      setStats({
        totalClicks: (buttonClicks || []).length,
        totalOrders,
        totalRevenue,
        uniqueVisitors: uniqueSessions.size,
        topButtons,
        topProductCartButtons,
        topProducts,
        topFavoritedProducts,
        topCheckedOutProducts,
        trafficByHour,
        deviceBreakdown,
        peakHours
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Access</h2>
            <p className="text-gray-600 mt-2">Enter password to access analytics dashboard</p>
          </div>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
            {authError && (
              <div className="mb-4 text-red-600 text-sm text-center">
                {authError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 transition-colors font-medium"
            >
              Access Dashboard
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-pink-600 hover:text-pink-700 text-sm font-medium"
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor your website performance and customer behavior</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Store</span>
              </Link>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '24h' | '7d' | '30d')}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Clicks"
            value={stats.totalClicks.toLocaleString()}
            icon={<MousePointer className="h-6 w-6 text-blue-600" />}
            color="border-l-blue-500"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            icon={<ShoppingCart className="h-6 w-6 text-green-600" />}
            color="border-l-green-500"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6 text-yellow-600" />}
            color="border-l-yellow-500"
          />
          <StatCard
            title="Unique Visitors"
            value={stats.uniqueVisitors.toLocaleString()}
            icon={<Users className="h-6 w-6 text-purple-600" />}
            color="border-l-purple-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Clicked Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MousePointer className="h-5 w-5 mr-2 text-blue-600" />
              Most Clicked Buttons
            </h3>
            <div className="space-y-3">
              {stats.topButtons.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No button click data available</p>
              ) : (
                stats.topButtons.map((button, index) => (
                  <div key={button.button_name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 w-6">{index + 1}.</span>
                      <span className="text-sm text-gray-900">{button.button_name}</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">{button.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Top Selling Products
            </h3>
            <div className="space-y-3">
              {stats.topProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No sales data available</p>
              ) : (
                stats.topProducts.map((product, index) => (
                  <div key={product.product_name} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-6">{index + 1}.</span>
                        <span className="text-sm text-gray-900 truncate">{product.product_name}</span>
                      </div>
                      <div className="ml-6 text-xs text-gray-500">
                        {product.sales} units • ₹{product.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Peak Traffic Hours */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-purple-600" />
              Peak Traffic Hours
            </h3>
            <div className="space-y-3">
              {stats.peakHours.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No traffic data available</p>
              ) : (
                stats.peakHours.map((hour, index) => (
                  <div key={hour.hour} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 w-6">{index + 1}.</span>
                      <span className="text-sm text-gray-900">{hour.hour}</span>
                    </div>
                    <span className="text-sm font-semibold text-purple-600">{hour.visits} visits</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
              Device Breakdown
            </h3>
            <div className="space-y-3">
              {stats.deviceBreakdown.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No device data available</p>
              ) : (
                stats.deviceBreakdown.map((device) => (
                  <div key={device.device_type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 capitalize">{device.device_type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{
                            width: `${(device.count / stats.deviceBreakdown.reduce((sum, d) => sum + d.count, 0)) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-orange-600">{device.count}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Product Cart Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-red-600" />
              Most Clicked Cart Buttons
            </h3>
            <div className="space-y-3">
              {stats.topProductCartButtons.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No cart button click data available</p>
              ) : (
                stats.topProductCartButtons.map((button, index) => (
                  <div key={button.button_name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 w-6">{index + 1}.</span>
                      <span className="text-sm text-gray-900">{button.button_name}</span>
                    </div>
                    <span className="text-sm font-semibold text-red-600">{button.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Favorited Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="h-5 w-5 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Most Favorited Products
            </h3>
            <div className="space-y-3">
              {stats.topFavoritedProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No favorite data available</p>
              ) : (
                stats.topFavoritedProducts.map((product, index) => (
                  <div key={product.product_name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 w-6">{index + 1}.</span>
                      <span className="text-sm text-gray-900 truncate">{product.product_name}</span>
                    </div>
                    <span className="text-sm font-semibold text-pink-600">{product.count} favorites</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Checked Out Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-teal-600" />
              Most Purchased Products
            </h3>
            <div className="space-y-3">
              {stats.topCheckedOutProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No purchase data available</p>
              ) : (
                stats.topCheckedOutProducts.map((product, index) => (
                  <div key={product.product_name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 w-6">{index + 1}.</span>
                      <span className="text-sm text-gray-900 truncate">{product.product_name}</span>
                    </div>
                    <span className="text-sm font-semibold text-teal-600">{product.count} purchased</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Hourly Traffic Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2 text-indigo-600" />
            Traffic by Hour
          </h3>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {Array.from({ length: 24 }, (_, hour) => {
              const hourData = stats.trafficByHour.find(h => h.hour === hour);
              const visits = hourData?.visits || 0;
              const maxVisits = Math.max(...stats.trafficByHour.map(h => h.visits), 1);
              const height = maxVisits > 0 ? (visits / maxVisits) * 100 : 0;

              return (
                <div key={hour} className="text-center">
                  <div className="relative h-20 flex items-end justify-center">
                    <div
                      className="bg-indigo-600 rounded-t w-full max-w-8 transition-all duration-300 hover:bg-indigo-700"
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${hour}:00 - ${visits} visits`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-1 block">{hour}:00</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
