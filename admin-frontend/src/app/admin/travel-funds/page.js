'use client';

import { useEffect, useMemo, useState } from 'react';
import { FiCheckCircle, FiRefreshCw, FiShield, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminAPI from '@/lib/AdminApi';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const fallbackFunds = [
  {
    id: 'tf_amboseli_weekend',
    fund_number: 'NYF-MAY-2401',
    title: 'Amboseli birthday weekend',
    mode: 'group_pool',
    status: 'collecting',
    organizer_name: 'Grace Wanjiku',
    target_amount: 186000,
    collected_amount: 128500,
    refundable_amount: 128500,
    nyle_commission_pending: 9300,
    supplier_payable_pending: 176700,
    participant_count: 8,
    paid_participant_count: 5,
    due_date: '2026-07-15',
    custody_provider: 'licensed_provider_or_escrow_partner',
    custody_status: 'safeguarded',
  },
  {
    id: 'tf_diani_layaway',
    fund_number: 'NYF-JUN-1028',
    title: 'Diani December escape',
    mode: 'installment_plan',
    status: 'collecting',
    organizer_name: 'Brian Otieno',
    target_amount: 242000,
    collected_amount: 60500,
    refundable_amount: 60500,
    nyle_commission_pending: 12100,
    supplier_payable_pending: 229900,
    participant_count: 2,
    paid_participant_count: 1,
    due_date: '2026-10-31',
    custody_provider: 'licensed_provider_or_escrow_partner',
    custody_status: 'safeguarded',
  },
];

function StatCard({ label, value, icon: Icon, tone = 'primary' }) {
  const toneClasses = {
    primary: 'bg-primary-50 text-primary-700',
    green: 'bg-green-50 text-green-700',
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
  };

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
        <Icon />
      </div>
      <p className="mt-4 text-sm font-semibold text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </article>
  );
}

export default function TravelFundsAdminPage() {
  const [funds, setFunds] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reconcilingId, setReconcilingId] = useState(null);

  const computedSummary = useMemo(() => {
    if (summary) return summary;
    return {
      total_customer_liability: funds.reduce((sum, fund) => sum + Number(fund.collected_amount || 0), 0),
      pending_nyle_commission: funds.reduce((sum, fund) => sum + Number(fund.nyle_commission_pending || 0), 0),
      pending_supplier_payables: funds.reduce((sum, fund) => sum + Number(fund.supplier_payable_pending || 0), 0),
      active_funds: funds.length,
      provider_configured: false,
      custody_provider: 'licensed_provider_or_escrow_partner',
    };
  }, [funds, summary]);

  useEffect(() => {
    const loadFunds = async () => {
      setLoading(true);
      try {
        const response = await adminAPI.getTravelFunds();
        setFunds(response.data.data.funds || []);
        setSummary(response.data.data.summary || null);
      } catch (error) {
        console.error('Failed to load travel funds:', error);
        setFunds(fallbackFunds);
        toast.error('Using placeholder travel fund data');
      } finally {
        setLoading(false);
      }
    };

    loadFunds();
  }, []);

  const reconcileFund = async (fund) => {
    setReconcilingId(fund.id);
    try {
      await adminAPI.reconcileTravelFund(fund.id, {
        action: 'mark_reviewed',
        provider_reference: fund.fund_number,
      });
      toast.success(`${fund.fund_number} marked reviewed`);
    } catch (error) {
      console.error('Reconciliation failed:', error);
      toast.error('Could not reconcile fund');
    } finally {
      setReconcilingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Travel Funds</h1>
          <p className="mt-2 text-gray-600">
            Track installment and group pool balances before they become supplier payables or Nyle revenue.
          </p>
        </div>
        <div className={`rounded-full px-4 py-2 text-sm font-bold ${computedSummary.provider_configured ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
          {computedSummary.provider_configured ? 'Provider configured' : 'Provider placeholder'}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Customer liability" value={formatCurrency(computedSummary.total_customer_liability)} icon={FiShield} tone="amber" />
        <StatCard label="Pending commission" value={formatCurrency(computedSummary.pending_nyle_commission)} icon={FiCheckCircle} tone="green" />
        <StatCard label="Supplier payables" value={formatCurrency(computedSummary.pending_supplier_payables)} icon={FiRefreshCw} tone="blue" />
        <StatCard label="Active funds" value={computedSummary.active_funds} icon={FiUsers} />
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h2 className="font-serif text-2xl font-bold text-gray-900">Fund ledger</h2>
          <p className="mt-1 text-sm text-gray-500">
            Custody provider: {computedSummary.custody_provider || 'licensed provider'}
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading travel funds...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Fund', 'Mode', 'Collected', 'Liability', 'Pending split', 'Due', 'Status', ''].map((heading) => (
                    <th key={heading} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {funds.map((fund) => (
                  <tr key={fund.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">{fund.title}</p>
                      <p className="text-xs text-gray-500">{fund.fund_number} by {fund.organizer_name}</p>
                    </td>
                    <td className="px-5 py-4 text-sm capitalize text-gray-700">{String(fund.mode || '').replace(/_/g, ' ')}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">{formatCurrency(fund.collected_amount)}</p>
                      <p className="text-xs text-gray-500">{fund.paid_participant_count}/{fund.participant_count} paid</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-amber-700">{formatCurrency(fund.refundable_amount)}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">
                      <p>Supplier: {formatCurrency(fund.supplier_payable_pending)}</p>
                      <p>Nyle: {formatCurrency(fund.nyle_commission_pending)}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{fund.due_date || 'Open'}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold capitalize text-primary-700">
                        {fund.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => reconcileFund(fund)}
                        disabled={reconcilingId === fund.id}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-primary-300 hover:text-primary-700 disabled:opacity-50"
                      >
                        {reconcilingId === fund.id ? 'Reviewing...' : 'Mark reviewed'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
