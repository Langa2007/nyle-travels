'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiFilter,
  FiMap,
  FiTrendingUp,
  FiDollarSign,
  FiBarChart2
} from 'react-icons/fi';
import { toursAPI } from '@/lib/api';
import Button from '@/components/ui/Button';

export default function AdminToursPage() {
  const [tours, setTours] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterDifficulty]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [toursRes, statsRes] = await Promise.all([
        toursAPI.getAll({ search: searchTerm, difficulty: filterDifficulty, limit: 100 }),
        toursAPI.getStats()
      ]);
      setTours(toursRes.data.data.tours);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this tour? It will no longer be visible to users.')) {
      try {
        await toursAPI.delete(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete tour');
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Manage Expeditions</h1>
          <p className="text-gray-500 mt-1">Curate and manage your luxury tour portfolio.</p>
        </div>
        <Link href="/admin/tours/new">
          <Button variant="primary" className="flex items-center space-x-2">
            <FiPlus /> <span>New Expedition</span>
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Portfolio', value: stats.overall.total_tours, icon: <FiMap />, color: '#0f766e' },
            { label: 'Market Reach', value: stats.overall.total_views, icon: <FiTrendingUp />, color: '#0369a1' },
            { label: 'Reservations', value: stats.overall.total_bookings, icon: <FiBarChart2 />, color: '#0f766e' },
            { label: 'Portfolio Avg', value: `$${Math.round(stats.overall.average_price)}`, icon: <FiDollarSign />, color: '#b45309' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${item.color}15`, color: item.color }}
              >
                {item.icon}
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">{item.label}</p>
              <p className="text-2xl font-serif font-bold text-gray-900">{item.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm mb-10 flex flex-col md:flex-row items-center gap-6">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or code..."
            className="w-full bg-gray-50 border-none rounded-2xl pl-16 pr-6 py-4 text-sm focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <select 
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-600 focus:ring-4 focus:ring-primary-500/10 transition-all cursor-pointer"
          >
            <option value="">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="challenging">Challenging</option>
            <option value="difficult">Difficult</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100">Expedition</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100">Region</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100">Pricing</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100">Performance</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="w-10 h-10 border-4 border-gray-50 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-400 font-medium italic">Synchronizing portfolio...</p>
                  </td>
                </tr>
              ) : tours.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-medium italic">
                    No expeditions matching your criteria.
                  </td>
                </tr>
              ) : (
                tours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden relative">
                          <img src={tour.featured_image || '/images/tours/placeholder.jpg'} alt="" className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{tour.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">{tour.package_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-600">{tour.destination_name}</p>
                    </td>
                    <td className="px-8 py-6 border-b border-gray-100">
                      <p className="text-lg font-serif font-bold text-gray-900">${tour.base_price}</p>
                      <p className="text-[10px] text-primary-500 font-bold uppercase tracking-widest">{tour.duration_days} Days</p>
                    </td>
                    <td className="px-8 py-6 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold text-gray-900">{tour.views_count}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Views</span>
                        </div>
                        <div className="w-px h-6 bg-gray-100" />
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold text-gray-900">{tour.booking_count}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Booked</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 border-b border-gray-100 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/tours/${tour.slug}`} target="_blank" className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-primary-500 transition-colors">
                          <FiEye size={18} />
                        </Link>
                        <Link href={`/admin/tours/${tour.id}`} className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-primary-500 transition-colors">
                          <FiEdit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(tour.id)}
                          className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
