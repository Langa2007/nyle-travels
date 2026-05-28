'use client';

import Link from 'next/link';
import { FiCreditCard, FiShield, FiSmartphone } from 'react-icons/fi';

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Payments</h1>
        <p className="mt-2 text-gray-600">
          Manage direct payments here, and use Travel Funds for installments, group pools, and customer-money custody.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <FiCreditCard />
          </div>
          <h2 className="mt-4 font-serif text-xl font-bold text-gray-900">Card and direct payments</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Stripe and ordinary direct payment records remain in the standard payment ledger.
          </p>
        </article>

        <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <FiSmartphone />
          </div>
          <h2 className="mt-4 font-serif text-xl font-bold text-gray-900">M-Pesa collections</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Daraja STK and callback reconciliation will land here once live credentials are configured.
          </p>
        </article>

        <Link href="/admin/travel-funds" className="block rounded-2xl border border-primary-100 bg-primary-50 p-6 shadow-sm transition hover:border-primary-300">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-700">
            <FiShield />
          </div>
          <h2 className="mt-4 font-serif text-xl font-bold text-gray-900">Travel Funds</h2>
          <p className="mt-2 text-sm leading-6 text-gray-700">
            Review installment balances, group pools, customer liabilities, supplier payables, and pending commission.
          </p>
        </Link>
      </div>
    </div>
  );
}
