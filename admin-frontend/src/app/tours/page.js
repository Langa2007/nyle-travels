'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiEye, FiFilter, FiImage, FiMapPin, FiCalendar } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { adminAPI } from '@/lib/AdminApi'; // Ensure this exists or mock for now
import toast from 'react-hot-toast';

export default function AdminTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Mock fetch
    setTours([
      { id: 1, name: 'Dubai Luxury Desert Safari', destination: 'Dubai, UAE', price: 1200, duration: 3, status: 'active', bookings: 45 },
      { id: 2, name: 'Maldives Overwater Retreat', destination: 'Maldives', price: 4500, duration: 7, status: 'active', bookings: 12 },
      { id: 3, name: 'Swiss Alps Ski Adventure', destination: 'Switzerland', price: 3200, duration: 5, status: 'draft', bookings: 0 },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold">Tour Packages</h1>
        <Button variant="luxury">
          <FiPlus className="mr-2" />
          Create New Tour
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[300px] relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tours..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
            />
          </div>
          <Button variant="outline"><FiFilter className="mr-2" /> Filters</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Package</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tours.map((tour) => (
                <motion.tr key={tour.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex flex-col items-center justify-center text-gray-500 overflow-hidden">
                        <FiImage size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{tour.name}</p>
                        <p className="text-sm text-gray-500 flex items-center"><FiMapPin className="mr-1" />{tour.destination}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="flex items-center text-gray-600"><FiCalendar className="mr-1" /> {tour.duration} Days</p>
                      <p className="text-gray-500">{tour.bookings} bookings</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${tour.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${tour.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {tour.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600"><FiEye size={18} /></button>
                      <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600"><FiEdit size={18} /></button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-600"><FiTrash2 size={18} /></button>
                    </div>
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
