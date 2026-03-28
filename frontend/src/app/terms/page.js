'use client';

import BasicStaticPage from '@/components/ui/BasicStaticPage';

export default function TermsPage() {
  const content = (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">1. Acceptance of Terms</h2>
        <p>
          By accessing and using the services of Nyle Travel & Tours, you agree to be bound by these Terms and Conditions. Our services include but are not limited to safari bookings, hotel reservations, and customized travel itineraries across Africa.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">2. Booking and Payments</h2>
        <p>
          A deposit of 30% is required at the time of booking to secure your reservation. The remaining balance must be settled at least 60 days before the commencement of your journey. All payments are processed securely through our verified luxury payment gateways.
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Payments can be made via Visa, Mastercard, American Express, or Bank Transfer.</li>
          <li>For last-minute bookings (within 60 days), full payment is required immediately.</li>
          <li>Prices are subject to change due to government levies or currency fluctuations.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">3. Cancellation and Refunds</h2>
        <p>
          We understand that plans can change. Our cancellation policy is designed to be fair while respecting our commitments to luxury lodges and specialized guides.
        </p>
        <div className="mt-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm text-primary-600">Cancellation Fees:</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b border-gray-200 pb-2">
              <span>90+ days before departure</span>
              <span className="font-semibold">Deposit Only</span>
            </li>
            <li className="flex justify-between border-b border-gray-200 pb-2">
              <span>60-89 days before departure</span>
              <span className="font-semibold">50% of Total Cost</span>
            </li>
            <li className="flex justify-between pb-2">
              <span>Less than 60 days before departure</span>
              <span className="font-semibold">100% of Total Cost</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">4. Luxury Travel Insurance</h2>
        <p>
          It is a mandatory requirement for all Nyle Travel clients to have comprehensive travel insurance. This must cover medical expenses, emergency repatriation, and trip cancellation. We recommend our specialized luxury insurance partner for optimal coverage in remote African locations.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">5. Governing Law</h2>
        <p>
          These terms are governed by the laws of the Republic of Kenya. Any disputes arising from these services shall be settled in the competent courts of Nairobi.
        </p>
      </section>
    </div>
  );

  return (
    <BasicStaticPage 
      title="Terms & Conditions" 
      subtitle="The formal agreements ensuring your luxury experience with Nyle Travel."
      content={content}
    />
  );
}
