'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiUser, FiPackage, FiCheckCircle, FiXCircle, FiMoreVertical } from 'react-icons/fi';
import Button from '@/components/ui/Button';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setBookings([
      { id: 'NYL429AB1', user: 'John Doe', tour: 'Dubai Luxury Desert Safari', amount: 3600, date: '2026-04-15', status: 'confirmed' },
      { id: 'NYL839XZ2', user: 'Jane Smith', tour: 'Maldives Overwater Retreat', amount: 4500, date: '2026-05-10', status: 'pending' },
      { id: 'NYL112RQ8', user: 'Ali Khan', tour: 'Swiss Alps Ski Adventure', amount: 6400, date: '2026-06-20', status: 'cancelled' },
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold">Bookings Management</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[300px] relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, user, or tour..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
            />
          </div>
          <Button variant="outline"><FiFilter className="mr-2" /> Status</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Booking ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tour / Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <motion.tr key={booking.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-600">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{booking.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{booking.tour}</p>
                    <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${booking.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 inline-flex">
                      <FiMoreVertical size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
