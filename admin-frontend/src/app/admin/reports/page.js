'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiMessageSquare, FiEye, FiX, FiCheck } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { adminAPI } from '@/lib/AdminApi';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, reviewing, resolved

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') {
        params.status = filter;
      }
      const response = await adminAPI.getReports(params);
      setReports(response.data.data.reports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminAPI.updateReportStatus(id, status);
      toast.success(`Marked as ${status}`);
      setReports(reports.map(rep => 
        rep.id === id ? { ...rep, status } : rep
      ));
      if (selectedReport?.id === id) {
        setSelectedReport({ ...selectedReport, status });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'bug': return 'text-red-600 bg-red-50';
      case 'content': return 'text-orange-600 bg-orange-50';
      case 'feedback': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">User Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Manage user-submitted reports, bugs, and feedback</p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          {['all', 'pending', 'reviewing', 'resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-gray-500">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FiAlertTriangle size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No reports found</h3>
            <p className="text-gray-500 mt-1">There are no reports matching your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reporter</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr 
                    key={report.id}
                    className={`hover:bg-gray-50 transition-colors ${report.status === 'pending' ? 'bg-red-50/20' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-md ${getTypeColor(report.type)} capitalize`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{report.name}</div>
                      <div className="text-sm text-gray-500">{report.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(report.status)} capitalize`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="text-primary-600 hover:text-primary-900 bg-primary-50 p-2 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-serif font-bold text-gray-900">Report Details</h3>
                  <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-md ${getTypeColor(selectedReport.type)} capitalize`}>
                    {selectedReport.type}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Reporter</p>
                    <p className="text-sm font-medium text-gray-900">{selectedReport.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <a href={`mailto:${selectedReport.email}`} className="hover:text-primary-600">
                        {selectedReport.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Timeline</p>
                    <p className="text-sm text-gray-900"><span className="font-medium">Submitted:</span> {new Date(selectedReport.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</p>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                    {selectedReport.description}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">Update Status:</span>
                    <select
                      value={selectedReport.status}
                      onChange={(e) => handleUpdateStatus(selectedReport.id, e.target.value)}
                      className={`text-sm border-0 rounded-lg ring-1 ring-inset pl-3 pr-8 py-1.5 focus:ring-2 focus:ring-primary-600 ${
                        selectedReport.status === 'pending' ? 'ring-red-300 bg-red-50 text-red-800' :
                        selectedReport.status === 'reviewing' ? 'ring-yellow-300 bg-yellow-50 text-yellow-800' :
                        'ring-green-300 bg-green-50 text-green-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      if (selectedReport.status === 'pending') {
                        handleUpdateStatus(selectedReport.id, 'reviewing');
                      }
                      setSelectedReport(null);
                    }}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
