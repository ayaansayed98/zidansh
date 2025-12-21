import React, { useState, useEffect } from 'react';
import { analyticsService } from '../lib/analytics';
import { CheckoutData } from '../types/analytics';
import { TrendingUp, TrendingDown, Users, Monitor, Smartphone, Tablet, Tv, Globe, ShoppingCart, Package, DollarSign, MousePointer, Clock, BarChart3, Lock, Eye, EyeOff, RefreshCw, Eye as ViewIcon, LogOut } from 'lucide-react';

interface MonthlyAudienceData {
  date: string;
  audience: number;
  unique_visitors: number;
}

interface SubscriberData {
  current: number;
  growth: number;
  growthPercent: number;
  trend: 'up' | 'down';
}

interface AudienceBehaviorData {
  newViewers: number;
  casualViewers: number;
  regularViewers: number;
}

interface DeviceTypeData {
  tv: number;
  mobile: number;
  computer: number;
  tablet: number;
}

interface AgeDemographicsData {
  age13_17: number;
  age18_24: number;
  age25_34: number;
  age35_44: number;
  age45_54: number;
  age55_64: number;
  age65_plus: number;
}

interface GeographyData {
  country: string;
  percentage: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [monthlyAudience, setMonthlyAudience] = useState<MonthlyAudienceData[]>([]);
  const [subscriberData, setSubscriberData] = useState<SubscriberData | null>(null);
  const [audienceBehavior, setAudienceBehavior] = useState<AudienceBehaviorData | null>(null);
  const [deviceTypeData, setDeviceTypeData] = useState<DeviceTypeData | null>(null);
  const [ageDemographics, setAgeDemographics] = useState<AgeDemographicsData | null>(null);
  const [geographyData, setGeographyData] = useState<GeographyData[]>([]);
  const [loading, setLoading] = useState(true);

  // Original analytics state
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
  const [error, setError] = useState<string | null>(null);
  const [peakEngagementAnalysis, setPeakEngagementAnalysis] = useState<any>(null);

  const ADMIN_PASSWORD = 'Ayaan98!';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
      localStorage.setItem('analytics_authenticated', 'true');
      fetchAnalyticsData();
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };

  useEffect(() => {
    // Check for existing authentication
    const authStatus = localStorage.getItem('analytics_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchAnalyticsData();
    }
  }, []);

  // Auto-refresh data every 30 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchAnalyticsData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('analytics_authenticated');
  };

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        monthlyData,
        subscriberInfo,
        behaviorData,
        deviceData,
        ageData,
        geoData,
        checkoutDataList,
        bulkOrdersList,
        buttonClicksList,
        pageViewsList,
        peakAnalysisData
      ] = await Promise.all([
        analyticsService.getMonthlyAudienceData(),
        analyticsService.getSubscriberAnalytics(),
        analyticsService.getAudienceBehaviorData(),
        analyticsService.getDeviceTypeAnalytics(),
        analyticsService.getAgeDemographicsData(),
        analyticsService.getGeographyAnalytics(),
        analyticsService.getCheckoutData(),
        analyticsService.getBulkOrders(),
        analyticsService.getButtonClicks(),
        analyticsService.getPageViews(),
        analyticsService.getPeakEngagementAnalysis()
      ]);

      setMonthlyAudience(monthlyData);
      setSubscriberData(subscriberInfo);
      setAudienceBehavior(behaviorData);
      setDeviceTypeData(deviceData);
      setAgeDemographics(ageData);
      setGeographyData(geoData);
      setCheckoutData(checkoutDataList);
      setBulkOrders(bulkOrdersList);
      setButtonClicks(buttonClicksList);
      setPageViews(pageViewsList);
      setPeakEngagementAnalysis(peakAnalysisData);

      // Calculate derived analytics
      const mostSelling = analyticsService.getMostSellingProducts(checkoutDataList);
      const leastSelling = analyticsService.getLeastSellingProducts(checkoutDataList);
      const peakTime = analyticsService.getPeakEngagementTime(buttonClicksList);
      const hourlyData = analyticsService.getHourlyEngagementData(buttonClicksList);
      const buttonStats = analyticsService.getButtonClickStats(buttonClicksList);
      const visitedPages = analyticsService.getMostVisitedPages(pageViewsList);
      const uniqueVisitorsCount = analyticsService.getUniqueVisitors(pageViewsList);

      setMostSellingProducts(mostSelling);
      setLeastSellingProducts(leastSelling);
      setPeakEngagementTime(peakTime);
      setHourlyEngagementData(hourlyData);
      setButtonClickStats(buttonStats);
      setMostVisitedPages(visitedPages);
      setUniqueVisitors(uniqueVisitorsCount);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to fetch analytics data');
    } finally {
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
      <div className="min-h-screen bg-gray-50 p-6">
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
              onClick={fetchAnalyticsData}
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Monitor your store performance and customer insights</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Lock</span>
              </button>
              <button
                onClick={fetchAnalyticsData}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Original Stats Cards */}
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
              <Clock className="w-8 h-8 text-purple-600" />
              <span className="text-sm text-gray-500">Hourly Engagement</span>
            </div>
            <div className="space-y-3">
              <div className="text-lg font-bold text-gray-900">
                Peak: {peakEngagementTime.timeRange} ({peakEngagementTime.count} clicks)
              </div>
              <div className="h-48 flex space-x-1 px-2 overflow-hidden">
                {hourlyEngagementData.map((data, index) => {
                  const maxCount = Math.max(...hourlyEngagementData.map(d => d.count));
                  const height = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
                  const isPeakHour = data.hour === peakEngagementTime.hour;

                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer min-w-0"
                      title={`${data.label}: ${data.count} clicks`}
                    >
                      <div
                        className={`w-full rounded-t transition-all duration-300 hover:opacity-80 ${isPeakHour
                          ? 'bg-purple-600'
                          : data.count > 0
                            ? 'bg-purple-400'
                            : 'bg-gray-200'
                          }`}
                        style={{ height: `${Math.max(height, 3)}%` }}
                      />
                      <span className={`text-xs mt-1 transition-all duration-300 whitespace-nowrap ${isPeakHour ? 'font-bold text-purple-600' : 'text-gray-500'
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

        {/* New Comprehensive Analytics Sections */}
        {/* Monthly Audience & Subscribers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Audience */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Monthly audience</h2>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  {monthlyAudience.length > 0 ?
                    (monthlyAudience[monthlyAudience.length - 1].audience / 1000).toFixed(1) :
                    '12.7'
                  }K
                </span>
                <span className="ml-2 text-sm text-gray-500">Current</span>
              </div>
              <div className="h-32 bg-gray-50 rounded flex items-end justify-between p-2">
                {monthlyAudience.slice(-7).map((data, index) => (
                  <div
                    key={index}
                    className="bg-purple-500 rounded-t"
                    style={{
                      height: `${(data.audience / 15000) * 100}%`,
                      width: '12%'
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Nov 14</span>
                <span>Dec 11</span>
              </div>
            </div>
          </div>

          {/* Subscribers */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Subscribers</h2>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  {subscriberData?.current || 2341}
                </span>
                <span className="ml-2 text-sm text-gray-500">Current</span>
              </div>
              <div className="flex items-center">
                {subscriberData?.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${subscriberData?.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {subscriberData?.growth || 31} ({subscriberData?.growthPercent || 32}% {subscriberData?.trend === 'up' ? 'more' : 'less'} than previous period)
                </span>
              </div>
              <div className="h-32 bg-gray-50 rounded flex items-end justify-between p-2">
                {[...Array(7)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-purple-500 rounded-t"
                    style={{
                      height: `${Math.random() * 80 + 20}%`,
                      width: '12%'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audience by Watch Behavior */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Audience by watch behavior</h2>
          <div className="space-y-3">
            {audienceBehavior && (
              <>
                <div className="flex items-center">
                  <span className="w-32 text-sm text-gray-600">New viewers</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 mr-4">
                    <div
                      className="bg-purple-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${audienceBehavior.newViewers}%` }}
                    >
                      <span className="text-xs text-white font-medium">{audienceBehavior.newViewers}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-sm text-gray-600">Casual viewers</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 mr-4">
                    <div
                      className="bg-purple-400 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${audienceBehavior.casualViewers}%` }}
                    >
                      <span className="text-xs text-white font-medium">{audienceBehavior.casualViewers}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-sm text-gray-600">Regular viewers</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 mr-4">
                    <div
                      className="bg-purple-300 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${audienceBehavior.regularViewers}%` }}
                    >
                      <span className="text-xs text-white font-medium">{audienceBehavior.regularViewers}%</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Device Type and Age Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Device Type */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Device type</h2>
            <p className="text-sm text-gray-500 mb-4">Watch time (hours) - Last 28 days</p>
            <div className="space-y-3">
              {deviceTypeData && (
                <>
                  <div className="flex items-center">
                    <div className="w-8 flex items-center justify-center mr-3">
                      <Tv className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="w-16 text-sm text-gray-600">TV</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                      <div
                        className="bg-purple-500 h-4 rounded-full"
                        style={{ width: `${deviceTypeData.tv}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 font-medium w-12">{deviceTypeData.tv}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 flex items-center justify-center mr-3">
                      <Smartphone className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="w-16 text-sm text-gray-600">Mobile</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                      <div
                        className="bg-purple-400 h-4 rounded-full"
                        style={{ width: `${deviceTypeData.mobile}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 font-medium w-12">{deviceTypeData.mobile}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 flex items-center justify-center mr-3">
                      <Monitor className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="w-16 text-sm text-gray-600">Computer</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                      <div
                        className="bg-purple-300 h-4 rounded-full"
                        style={{ width: `${deviceTypeData.computer}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 font-medium w-12">{deviceTypeData.computer}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 flex items-center justify-center mr-3">
                      <Tablet className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="w-16 text-sm text-gray-600">Tablet</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                      <div
                        className="bg-purple-200 h-4 rounded-full"
                        style={{ width: `${deviceTypeData.tablet}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 font-medium w-12">{deviceTypeData.tablet}%</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Age Demographics */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Age</h2>
            <p className="text-sm text-gray-500 mb-4">Last 28 days - Views</p>
            <div className="space-y-3">
              {ageDemographics && (
                <>
                  <div className="flex items-center">
                    <span className="w-16 text-sm text-gray-600">13-17</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                      <div
                        className="bg-purple-500 h-4 rounded-full"
                        style={{ width: `${ageDemographics.age13_17}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 font-medium w-12">{ageDemographics.age13_17}%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-16 text-sm text-gray-600">18-24</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                      <div
                        className="bg-purple-500 h-4 rounded-full"
                        style={{ width: `${ageDemographics.age18_24}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 font-medium w-12">{ageDemographics.age18_24}%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-16 text-sm text-gray-600">25-34</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                      <div
                        className="bg-purple-500 h-4 rounded-full"
                        style={{ width: `${ageDemographics.age25_34}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 font-medium w-12">{ageDemographics.age25_34}%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-16 text-sm text-gray-600">35-44</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                      <div
                        className="bg-purple-500 h-4 rounded-full"
                        style={{ width: `${ageDemographics.age35_44}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 font-medium w-12">{ageDemographics.age35_44}%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-16 text-sm text-gray-600">45-54</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                      <div
                        className="bg-purple-500 h-4 rounded-full"
                        style={{ width: `${ageDemographics.age45_54}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 font-medium w-12">{ageDemographics.age45_54}%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-16 text-sm text-gray-600">55-64</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                      <div
                        className="bg-purple-500 h-4 rounded-full"
                        style={{ width: `${ageDemographics.age55_64}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 font-medium w-12">{ageDemographics.age55_64}%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-16 text-sm text-gray-600">65+</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                      <div
                        className="bg-purple-500 h-4 rounded-full"
                        style={{ width: `${ageDemographics.age65_plus}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 font-medium w-12">{ageDemographics.age65_plus}%</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Geography */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Geography</h2>
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-4">Views • Last 28 days</p>
          <div className="space-y-3">
            {geographyData.map((country, index) => (
              <div key={index} className="flex items-center">
                <span className="w-24 text-sm text-gray-600">{country.country}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                  <div
                    className="bg-purple-500 h-4 rounded-full"
                    style={{ width: `${country.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-900 font-medium w-12">{country.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comprehensive Peak Engagement Analysis */}
        {peakEngagementAnalysis && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Peak Engagement Analysis - Entire Website Period</h2>
              <Clock className="w-6 h-6 text-purple-600" />
            </div>

            {/* Overall Peak Hour */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Overall Peak Hour</h3>
                <div className="text-2xl font-bold text-purple-900">
                  {peakEngagementAnalysis.overallPeakHour.timeRange}
                </div>
                <div className="text-sm text-purple-700 mt-1">
                  {peakEngagementAnalysis.overallPeakHour.engagementPercentage}% of total engagement
                </div>
                <div className="flex justify-between text-xs text-purple-600 mt-2">
                  <span>{peakEngagementAnalysis.overallPeakHour.clicks} clicks</span>
                  <span>{peakEngagementAnalysis.overallPeakHour.pageViews} page views</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Engagement</h3>
                <div className="text-2xl font-bold text-blue-900">
                  {peakEngagementAnalysis.totalMetrics.totalEngagement.toLocaleString()}
                </div>
                <div className="text-sm text-blue-700 mt-1">
                  Avg: {peakEngagementAnalysis.totalMetrics.averageHourlyEngagement.toFixed(1)}/hour
                </div>
                <div className="flex justify-between text-xs text-blue-600 mt-2">
                  <span>{peakEngagementAnalysis.totalMetrics.totalClicks} total clicks</span>
                  <span>{peakEngagementAnalysis.totalMetrics.totalPageViews} total page views</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Most Active Period</h3>
                <div className="text-2xl font-bold text-green-900">
                  {(() => {
                    const periods = Object.entries(peakEngagementAnalysis.periodAnalysis) as [string, { percentage: string }][];
                    const topPeriod = periods.sort(([, a], [, b]) => parseFloat(b.percentage) - parseFloat(a.percentage))[0];
                    return topPeriod[0].charAt(0).toUpperCase() + topPeriod[0].slice(1);
                  })()}
                </div>
                <div className="text-sm text-green-700 mt-1">
                  {(() => {
                    const periods = Object.entries(peakEngagementAnalysis.periodAnalysis) as [string, { percentage: string }][];
                    const topPeriod = periods.sort(([, a], [, b]) => parseFloat(b.percentage) - parseFloat(a.percentage))[0];
                    return topPeriod[1].percentage + '% of engagement';
                  })()}
                </div>
              </div>
            </div>

            {/* Top 3 Peak Hours */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Top 3 Peak Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {peakEngagementAnalysis.topPeakHours.map((hour: any, index: number) => (
                  <div key={hour.hour} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        #{index + 1} Peak
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {hour.timeRange}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${hour.engagementPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{hour.clicks} clicks</span>
                      <span>{hour.pageViews} views</span>
                      <span className="font-semibold">{hour.engagementPercentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Period Analysis */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Engagement by Time Period</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(peakEngagementAnalysis.periodAnalysis).map(([period, data]: [string, any]) => (
                  <div key={period} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="text-sm font-medium text-gray-600 capitalize mb-1">
                      {period}
                    </div>
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      {data.percentage}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {data.totalClicks} clicks, {data.totalPageViews} views
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Day of Week Analysis */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Engagement by Day of Week</h3>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                {peakEngagementAnalysis.dayOfWeekAnalysis.map((day: any) => (
                  <div key={day.day} className="bg-gray-50 p-2 rounded-lg border border-gray-200 text-center">
                    <div className="text-xs font-medium text-gray-600 mb-1">
                      {day.day.slice(0, 3)}
                    </div>
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {day.totalScore}
                    </div>
                    <div className="text-xs text-gray-600">
                      {day.clicks}c / {day.pageViews}v
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 24-Hour Engagement Chart */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">24-Hour Engagement Breakdown</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="h-48 flex items-end space-x-1 px-2">
                  {peakEngagementAnalysis.hourlyBreakdown.map((hour: any, index: number) => {
                    const maxScore = Math.max(...peakEngagementAnalysis.hourlyBreakdown.map((h: any) => h.totalScore));
                    const height = maxScore > 0 ? (hour.totalScore / maxScore) * 100 : 0;
                    const isPeakHour = hour.hour === peakEngagementAnalysis.overallPeakHour.hour;

                    return (
                      <div
                        key={hour.hour}
                        className="flex-1 flex flex-col items-center group cursor-pointer min-w-0"
                        title={`${hour.timeRange}: ${hour.totalScore} engagement score (${hour.engagementPercentage}%)`}
                      >
                        <div
                          className={`w-full rounded-t transition-all duration-300 hover:opacity-80 ${isPeakHour
                            ? 'bg-purple-600'
                            : hour.totalScore > 0
                              ? 'bg-purple-400'
                              : 'bg-gray-300'
                            }`}
                          style={{ height: `${Math.max(height, 3)}%` }}
                        />
                        <span className={`text-xs mt-1 transition-all duration-300 whitespace-nowrap ${isPeakHour ? 'font-bold text-purple-600' : 'text-gray-500'
                          } ${index % 3 === 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          {hour.hour % 12 === 0 ? 12 : hour.hour % 12}{hour.hour < 12 ? 'a' : 'p'}
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
        )}

        {/* Original Analytics Sections */}
        {/* Most Selling, Most Visited, Least Selling Products */}
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
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
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
};

export default AnalyticsDashboard;
