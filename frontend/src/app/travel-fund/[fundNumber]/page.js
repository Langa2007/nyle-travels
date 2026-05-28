'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { FiCheckCircle, FiPhone, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { travelFundsAPI } from '@/lib/api';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function TravelFundContributionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const fundNumber = params.fundNumber;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [contribution, setContribution] = useState(null);

  const handleContribute = async (event) => {
    event.preventDefault();
    setLoading(true);
    setContribution(null);

    try {
      const response = await travelFundsAPI.contribute(fundNumber, {
        name,
        phone,
        amount,
        token: searchParams.get('token'),
      });
      setContribution(response.data.data.contribution);
      toast.success('Contribution request accepted');
    } catch (error) {
      console.error('Contribution failed:', error);
      toast.error(error.response?.data?.message || 'Could not start contribution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-28">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleContribute} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-primary-700">
            <FiPhone />
            <span className="text-sm font-bold uppercase tracking-widest">M-Pesa contribution</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-bold text-gray-900">Contribute to {fundNumber}</h1>
          <p className="mt-3 text-gray-600">
            Your payment is recorded against this trip fund and treated as customer money until the trip is confirmed.
          </p>

          <div className="mt-8 grid gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Your name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                placeholder="Jane Wanjiku"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">M-Pesa phone</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                placeholder="2547..."
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Amount</span>
              <input
                type="number"
                min="10"
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                required
              />
            </label>
          </div>

          {contribution && (
            <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-900">
              <div className="flex gap-3">
                <FiCheckCircle className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold">Contribution recorded</p>
                  <p className="mt-1">
                    {formatCurrency(contribution.amount)} is currently marked as {contribution.status}. Live STK depends
                    on provider credentials.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" loading={loading} fullWidth className="mt-6">
            Send STK request
          </Button>
        </form>

        <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <FiShield />
          </div>
          <h2 className="mt-4 font-serif text-2xl font-bold text-gray-900">Fund custody</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Contributions are not booked as Nyle revenue immediately. The ledger keeps the contributor balance,
            supplier payable, and pending commission separate until trip confirmation.
          </p>
        </aside>
      </section>
    </main>
  );
}
