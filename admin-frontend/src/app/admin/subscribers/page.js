'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiMail,
  FiCalendar,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiUser
} from 'react-icons/fi';
import { adminAPI } from '@/lib/AdminApi';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  unsubscribed: 'bg-gray-100 text-gray-800',
  bounced: 'bg-red-100 text-red-800',
};

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, [pagination.page, search]);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getSubscribers({
        page: pagination.page,
        limit: pagination.limit,
        search,
      });
      // The backend returns { status: 'success', data: { subscribers: [], total: 0 } }
      const { subscribers: subList, total } = response.data.data;
      setSubscribers(subList);
      setPagination(prev => ({
        ...prev,
        total,
        pages: Math.ceil(total / prev.limit)
      }));
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSubscriber) return;
    setActionLoading(true);
    try {
      await adminAPI.deleteSubscriber(selectedSubscriber.id);
      toast.success('Subscriber removed successfully');
      fetchSubscribers();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to remove subscriber');
    } finally {
      setActionLoading(false);
    }
  };

  const exportSubscribers = () => {
    const csv = [
      ['Email', 'Status', 'Joined Date'],
      ...subscribers.map(s => [s.email, s.status, new Date(s.created_at).toLocaleDateString()])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `subscribers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold">Newsletter Subscribers</h1>
          <p className="text-gray-500 mt-1">Manage your community and email marketing list</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={exportSubscribers}>
            <FiDownload className="mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Subscribers</p>
              <h3 className="text-2xl font-bold mt-1">{pagination.total}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <FiUser className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active</p>
              <h3 className="text-2xl font-bold mt-1">
                {subscribers.filter(s => s.status === 'active').length}
              </h3>
            </div>
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <FiCheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Unsubscribed</p>
              <h3 className="text-2xl font-bold mt-1">
                {subscribers.filter(s => s.status === 'unsubscribed').length}
              </h3>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl text-gray-600">
              <FiXCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Email Address</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <FiMail className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[sub.status]}`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-2" />
                        {new Date(sub.created_at).toLocaleDateString(undefined, {
                           year: 'numeric',
                           month: 'short',
                           day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedSubscriber(sub);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Subscriber"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        {pagination.pages > 1 && (
          <div className="p-6 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
             <span>Showing {subscribers.length} of {pagination.total}</span>
             <div className="flex space-x-2">
                <Button 
                   variant="outline" 
                   size="sm"
                   disabled={pagination.page === 1}
                   onClick={() => setPagination(p => ({...p, page: p.page - 1}))}
                >
                   Previous
                </Button>
                <Button 
                   variant="outline" 
                   size="sm"
                   disabled={pagination.page === pagination.pages}
                   onClick={() => setPagination(p => ({...p, page: p.page + 1}))}
                >
                   Next
                </Button>
             </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Remove Subscriber"
          >
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove <span className="font-semibold">{selectedSubscriber?.email}</span> from your newsletter list? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  loading={actionLoading}
                >
                  Confirm Removal
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
