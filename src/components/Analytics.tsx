import { useState, useEffect } from 'react';
import { analyticsService } from '../lib/analytics';
import { CheckoutData } from '../types/analytics';
import { ShoppingCart, TrendingUp, Package, DollarSign, MousePointer, Clock, TrendingDown, BarChart3, Lock, Eye, EyeOff, RefreshCw, Users, Eye as ViewIcon } from 'lucide-react';

export default function Analytics() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [checkoutData, setCheckoutData] = useState<CheckoutData[]>([]);
  const [bulkOrders, setBulkOrders] = useState<any[]>([]);
  const [buttonClicks, setButtonClicks] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [mostSellingProducts, setMostSellingProducts] = useState<any[]>([]);
  const [leastSellingProducts, setLeastSellingProducts] = useState<any[]>([]);
  const [peakEngagementTime, setPeakEngagementTime] = useState<any>({ hour: 12, count: 0, timeRange: '12:00 PM - 1:00 PM' });
  const [hourlyEngagementData, setHourlyEngagementData] = useState<any[]>([]);
  const [buttonClickStats, setButtonClickStats] = useState<any[]>([]);
  const [mostVisitedPages, setMostVisitedPages] = useState<any[]>([]);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ADMIN_PASSWORD = 'Ayaan98!'; // Set your password here

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
      localStorage.setItem('analytics_authenticated', 'true');
      fetchData();
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };

  useEffect(() => {
    // Check for existing authentication
    const authStatus = localStorage.getItem('analytics_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  // Auto-refresh data every 30 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [checkoutDataList, bulkOrdersList, buttonClicksList, pageViewsList] = await Promise.all([
        analyticsService.getCheckoutData(),
        analyticsService.getBulkOrders(),
        analyticsService.getButtonClicks(),
        analyticsService.getPageViews()
      ]);
      
      console.log('Checkout data fetched:', checkoutDataList.length, 'items');
      console.log('Bulk orders fetched:', bulkOrdersList.length, 'items');
      console.log('Button clicks fetched:', buttonClicksList.length, 'items');
      console.log('Page views fetched:', pageViewsList.length, 'items');
      console.log('Sample checkout data:', checkoutDataList[0]);
      console.log('Sample bulk order:', bulkOrdersList[0]);
      console.log('Sample button click:', buttonClicksList[0]);
      console.log('Sample page view:', pageViewsList[0]);
      
      setCheckoutData(checkoutDataList);
      setBulkOrders(bulkOrdersList);
      setButtonClicks(buttonClicksList);
      setPageViews(pageViewsList);
      
      // Calculate derived analytics
      const mostSelling = analyticsService.getMostSellingProducts(checkoutDataList);
      const leastSelling = analyticsService.getLeastSellingProducts(checkoutDataList);
      const peakTime = analyticsService.getPeakEngagementTime(buttonClicksList);
      const hourlyData = analyticsService.getHourlyEngagementData(buttonClicksList);
      const buttonStats = analyticsService.getButtonClickStats(buttonClicksList);
      const visitedPages = analyticsService.getMostVisitedPages(pageViewsList);
      const uniqueVisitorsCount = analyticsService.getUniqueVisitors(pageViewsList);
      
      console.log('Button stats calculated:', buttonStats);
      console.log('Peak engagement time:', peakTime);
      console.log('Hourly engagement data:', hourlyData);
      console.log('Most visited pages:', visitedPages);
      console.log('Unique visitors:', uniqueVisitorsCount);
      console.log('Most selling products:', mostSelling);
      console.log('Least selling products:', leastSelling);
      
      setMostSellingProducts(mostSelling);
      setLeastSellingProducts(leastSelling);
      setPeakEngagementTime(peakTime);
      setHourlyEngagementData(hourlyData);
      setButtonClickStats(buttonStats);
      setMostVisitedPages(visitedPages);
      setUniqueVisitors(uniqueVisitorsCount);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to fetch analytics data');
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalRevenue = checkoutData.reduce((sum, order) => sum + order.total_amount, 0);
    const totalOrders = checkoutData.length;
    const totalProducts = 0;
    const totalButtonClicks = buttonClicks.length;
    const totalPageViews = pageViews.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalProducts,
      totalButtonClicks,
      totalPageViews,
      uniqueVisitors
    };
  };

  const stats = calculateStats();

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center mb-6">
              <Lock className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Analytics Access
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Enter password to access analytics dashboard
            </p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {authError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{authError}</p>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Access Analytics
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Protected access for authorized personnel only
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 text-lg font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Monitor your store performance and customer insights</p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <span className="text-sm text-gray-500">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <span className="text-sm text-gray-500">Total Orders</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalOrders}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <span className="text-sm text-gray-500">Avg Order Value</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{stats.avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <MousePointer className="w-8 h-8 text-orange-600" />
              <span className="text-sm text-gray-500">Buttons Clicked</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalButtonClicks}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <ViewIcon className="w-8 h-8 text-cyan-600" />
              <span className="text-sm text-gray-500">Page Views</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalPageViews}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-indigo-600" />
              <span className="text-sm text-gray-500">Unique Visitors</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.uniqueVisitors}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-amber-600" />
              <span className="text-sm text-gray-500">Products in Cart</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalProducts}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md xl:col-span-3 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-teal-600" />
              <span className="text-sm text-gray-500">Hourly Engagement</span>
            </div>
            <div className="space-y-3">
              <div className="text-lg font-bold text-gray-900">
                Peak: {peakEngagementTime.timeRange} ({peakEngagementTime.count} clicks)
              </div>
              <div className="h-48 flex items-end space-x-1 px-2 overflow-hidden">
                {hourlyEngagementData.map((data, index) => {
                  const maxCount = Math.max(...hourlyEngagementData.map(d => d.count));
                  const height = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
                  const isPeakHour = data.hour === peakEngagementTime.hour;
                  
                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center group cursor-pointer min-w-0"
                      title={`${data.label}: ${data.count} clicks`}
                    >
                      <div
                        className={`w-full rounded-t transition-all duration-300 hover:opacity-80 ${
                          isPeakHour 
                            ? 'bg-teal-600' 
                            : data.count > 0 
                              ? 'bg-teal-400' 
                              : 'bg-gray-200'
                        }`}
                        style={{ height: `${Math.max(height, 3)}%` }}
                      />
                      <span className={`text-xs mt-1 transition-all duration-300 whitespace-nowrap ${
                        isPeakHour ? 'font-bold text-teal-600' : 'text-gray-500'
                      } ${index % 2 === 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {data.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>11 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Most Selling Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Most Selling Products</h2>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            {mostSellingProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sales data yet</p>
            ) : (
              <div className="space-y-3">
                {mostSellingProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-gray-900 font-medium">{product.name}</span>
                    </div>
                    <span className="text-gray-600 font-semibold">{product.quantity} sold</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Most Visited Pages */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Most Visited Pages</h2>
              <ViewIcon className="w-6 h-6 text-cyan-600" />
            </div>
            {mostVisitedPages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No page view data yet</p>
            ) : (
              <div className="space-y-3">
                {mostVisitedPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                        <span className="text-cyan-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-gray-900 font-medium text-sm truncate">{page.page_url}</span>
                    </div>
                    <span className="text-cyan-600 font-semibold">{page.views} views</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Least Selling Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Least Selling Products</h2>
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            {leastSellingProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sales data yet</p>
            ) : (
              <div className="space-y-3">
                {leastSellingProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-gray-900 font-medium">{product.name}</span>
                    </div>
                    <span className="text-gray-600 font-semibold">{product.quantity} sold</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Button Clicks Analytics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Button Clicks Analytics</h2>
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          {buttonClickStats.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No button click data yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buttonClickStats.slice(0, 9).map((button, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-gray-900 font-medium text-sm truncate">{button.name}</span>
                  <span className="text-blue-600 font-bold">{button.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {checkoutData.length === 0 && bulkOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No orders yet</p>
              <p className="text-xs text-gray-400">
                Orders will appear here when customers complete checkout or submit bulk orders
              </p>
              {loading === false && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    Debug: Fetched {checkoutData.length} regular orders and {bulkOrders.length} bulk orders from database
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer/Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity/Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status/Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Regular Orders */}
                  {checkoutData.slice(0, 5).map((order) => (
                    <tr key={`regular-${order.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.order_number || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Regular
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customer_info?.email_address || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{order.total_amount?.toLocaleString('en-IN') || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {order.payment_method || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                  {/* Bulk Orders */}
                  {bulkOrders.slice(0, 5).map((order) => (
                    <tr key={`bulk-${order.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        BULK-{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Bulk
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.type || 'N/A'}
                        {order.details && <div className="text-xs text-gray-400">{order.details}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.quantity || 0} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
