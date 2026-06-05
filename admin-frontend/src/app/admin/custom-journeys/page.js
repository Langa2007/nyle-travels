"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiEye, FiX, FiMail, FiCompass, FiRefreshCw, FiUser } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { adminAPI } from '@/lib/AdminApi';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

const statusStyles = {
  unread: 'bg-sky-50 text-sky-700 border-sky-200',
  read: 'bg-gray-100 text-gray-700 border-gray-200',
  replied: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const briefLabels = {
  Destination: 'Destination',
  'Preferred travel date': 'Preferred date',
  'Date flexibility': 'Date flexibility',
  Travelers: 'Travelers',
  'Budget range': 'Budget',
  'Preferred pace': 'Pace',
  Occasion: 'Occasion',
  'Planning stage': 'Planning stage',
  'Journey style': 'Journey style',
  Notes: 'Notes',
};

function parseJourneyBrief(message = '') {
  return message.split('\n').reduce((acc, line) => {
    const separator = line.indexOf(':');
    if (separator === -1) return acc;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (key && briefLabels[key]) {
      acc[key] = value || 'Not specified';
    }
    return acc;
  }, {});
}

function getJourneySummary(brief) {
  const parts = [
    brief.Destination,
    brief['Preferred travel date'] && brief['Preferred travel date'] !== 'Flexible'
      ? brief['Preferred travel date']
      : brief['Date flexibility'],
    brief.Travelers,
  ].filter(Boolean);

  return parts.length ? parts.join(' · ') : 'Custom journey brief';
}

export default function CustomJourneysPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const selectedBrief = selected ? parseJourneyBrief(selected.message) : {};

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getContacts({ interest: 'Custom Journey Request', limit: 50 });
      setItems(response.data?.data?.contacts || []);
    } catch (error) {
      console.error('Failed to fetch custom journeys:', error);
      toast.error('Failed to load custom journeys');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await adminAPI.updateContactStatus(id, status);
      setItems(items.map(i => i.id === id ? { ...i, status } : i));
      if (selected?.id === id) setSelected({ ...selected, status });
      toast.success('Status updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Custom Journeys</h1>
          <p className="text-gray-500 text-sm mt-1">Submissions from the Custom Journey page</p>
        </div>
        <div>
          <Button variant="outline" onClick={fetchItems} loading={loading} icon={FiRefreshCw}>Refresh</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-gray-500">Loading submissions...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FiCompass size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No custom journeys found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sender</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Summary</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((it) => {
                  const brief = parseJourneyBrief(it.message);
                  const statusClass = statusStyles[it.status] || statusStyles.read;

                  return (
                    <tr key={it.id} className={`hover:bg-gray-50 transition-colors ${it.status === 'unread' ? 'bg-primary-50/30' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold">
                            {(it.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{it.name}</div>
                            <div className="text-sm text-gray-500">{it.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[48ch]">
                          <div className="text-sm font-medium text-gray-900">{getJourneySummary(brief)}</div>
                          <div className="mt-1 text-xs text-gray-500 line-clamp-2">{brief.Notes || it.message}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border capitalize ${statusClass}`}>{it.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDistanceToNow(new Date(it.created_at), { addSuffix: true })}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => setSelected(it)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors hover:bg-primary-100 hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                          title="View details"
                          aria-label={`View custom journey from ${it.name}`}
                        >
                          <FiEye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="text-lg font-serif font-bold text-gray-900">Custom Journey</h3>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Close custom journey details"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="overflow-y-auto p-6">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">From</p>
                    <p className="text-sm font-medium text-gray-900">{selected.name}</p>
                    <p className="text-sm text-gray-600 mt-1"><FiMail className="inline mr-2 text-gray-400" /> <a href={`mailto:${selected.email}`} className="hover:text-primary-600">{selected.email}</a></p>
                    {selected.phone && <p className="text-sm text-gray-600 mt-1">{selected.phone}</p>}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Details</p>
                    <p className="text-sm text-gray-900"><span className="font-medium">Interest:</span> {selected.interest}</p>
                    <p className="text-sm text-gray-900 mt-1"><span className="font-medium">Date:</span> {new Date(selected.created_at).toLocaleString()}</p>
                    <p className="mt-3 text-sm text-gray-700"><span className="font-medium">Status:</span> <span className="capitalize">{selected.status}</span></p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Journey Brief</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      ['Destination', selectedBrief.Destination, FiCompass],
                      ['Preferred date', selectedBrief['Preferred travel date'], FiCalendar],
                      ['Date flexibility', selectedBrief['Date flexibility'], FiCalendar],
                      ['Travelers', selectedBrief.Travelers, FiUser],
                      ['Budget', selectedBrief['Budget range'], null],
                      ['Pace', selectedBrief['Preferred pace'], null],
                      ['Occasion', selectedBrief.Occasion, null],
                      ['Planning stage', selectedBrief['Planning stage'], null],
                      ['Journey style', selectedBrief['Journey style'], null],
                    ].map(([label, value, Icon]) => (
                      <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          {Icon && <Icon className="h-4 w-4 text-primary-500" aria-hidden="true" />}
                          {label}
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-900">{value || 'Not specified'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Notes</p>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">{selectedBrief.Notes || selected.message}</div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" onClick={() => updateStatus(selected.id, 'read')}>Mark Read</Button>
                    <Button variant="outline" onClick={() => updateStatus(selected.id, 'replied')}>Mark Replied</Button>
                    <a href={`mailto:${selected.email}?subject=Re: Your Custom Journey`}><Button variant="primary">Reply by Email</Button></a>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" href={`/admin/tours/new?source=contact&id=${selected.id}`}>Create Tour</Button>
                    <Button variant="outline" href={`/admin/safaris/new?source=contact&id=${selected.id}`}>Create Safari</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
