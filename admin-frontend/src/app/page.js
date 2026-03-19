'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiPackage,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { adminAPI } from '@/lib/AdminApi';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {change !== undefined && (
        <div className={`flex items-center text-sm ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {change >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm text-gray-600">{title}</p>
  </motion.div>
);

const ActivityItem = ({ activity }) => (
  <div className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-0">
    <div className={`w-2 h-2 rounded-full ${
      activity.type === 'booking' ? 'bg-blue-500' :
      activity.type === 'user' ? 'bg-green-500' :
      'bg-purple-500'
    }`} />
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900">
        {activity.type === 'booking' && 'New booking created'}
        {activity.type === 'user' && 'New user registered'}
        {activity.type === 'payment' && 'Payment received'}
      </p>
      <p className="text-xs text-gray-500">{activity.reference}</p>
    </div>
    <span className="text-xs text-gray-400">
      {new Date(activity.created_at).toLocaleTimeString()}
    </span>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboardStats(timeframe);
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = {
    labels: stats?.monthlyStats?.map(s => 
      new Date(s.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    ) || [],
    datasets: [
      {
        label: 'Revenue',
        data: stats?.monthlyStats?.map(s => s.revenue) || [],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Bookings',
        data: stats?.monthlyStats?.map(s => s.total_bookings) || [],
        borderColor: '#d946ef',
        backgroundColor: 'rgba(217, 70, 239, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance Overview',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Revenue ($)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Bookings',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === t
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.overview?.totalUsers?.toLocaleString() || '0'}
          change={12.5}
          icon={FiUsers}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Total Tours"
          value={stats?.overview?.totalTours?.toLocaleString() || '0'}
          change={8.2}
          icon={FiPackage}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          title="Total Bookings"
          value={stats?.overview?.totalBookings?.toLocaleString() || '0'}
          change={-3.1}
          icon={FiCalendar}
          color="from-yellow-500 to-orange-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.overview?.totalRevenue?.toLocaleString() || '0'}`}
          change={15.3}
          icon={FiDollarSign}
          color="from-purple-500 to-pink-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-1">
            {stats?.recentActivity?.map((activity, i) => (
              <ActivityItem key={i} activity={activity} />
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-500 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" href="/admin/users/new">
                Add User
              </Button>
              <Button variant="outline" size="sm" href="/admin/tours/new">
                New Tour
              </Button>
              <Button variant="outline" size="sm" href="/admin/reports">
                Reports
              </Button>
              <Button variant="outline" size="sm" href="/admin/settings">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Destinations */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Top Destinations</h3>
          <div className="space-y-4">
            {stats?.topDestinations?.map((dest, i) => (
              <div key={i} className="flex items-center">
                <span className="text-sm font-medium w-32 truncate">{dest.destination}</span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(dest.bookings / stats.topDestinations[0].bookings) * 100}%` }}
                      className="h-full bg-primary-600 rounded-full"
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-600">{dest.bookings} bookings</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Booking Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <FiCheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">145</div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <FiClock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">23</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <FiXCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">8</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <FiAlertCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}