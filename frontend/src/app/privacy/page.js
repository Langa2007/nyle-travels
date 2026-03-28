'use client';

import BasicStaticPage from '@/components/ui/BasicStaticPage';

export default function PrivacyPage() {
  const content = (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">Introduction</h2>
        <p>
          At Nyle Travel, we are committed to protecting your privacy and security. Our Privacy Policy explains how we collect, use, and safeguard the personal information you provide to us when you visit our website or use our services.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">Information We Collect</h2>
        <p>
          We collect personal information that is necessary for processing your luxury travel bookings and enhancing your experience with us. This include but is not limited to:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Contact information (name, email address, phone number).</li>
          <li>Booking details (destinations, dates, preferences).</li>
          <li>Payment information (securely processed via our partners).</li>
          <li>Travel documents (passport copies, certificates as required).</li>
          <li>User feedback and preferences.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">How We Use Your Data</h2>
        <p>
          We use your information to:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h4 className="font-semibold mb-2 text-primary-600">Service Delivery</h4>
            <p className="text-sm">To process your bookings, manage itineraries, and provide personalized services.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h4 className="font-semibold mb-2 text-primary-600">Communication</h4>
            <p className="text-sm">To send you booking confirmations, travel tips, and marketing communications you have opted for.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h4 className="font-semibold mb-2 text-primary-600">Personalization</h4>
            <p className="text-sm">To tailor our website and services to your interests and preferences.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h4 className="font-semibold mb-2 text-primary-600">Security</h4>
            <p className="text-sm">To protect our services from fraud and abuse.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">Data Sharing and Disclosure</h2>
        <p>
          We do not sell your personal information. We may share your data with trusted third-party partners who assist us in providing our services, such as luxury lodges, airline partners, and specialized guides. These partners are required to protect your data according to our privacy standards.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">Your Rights</h2>
        <p>
          You have the right to access, update, and delete your personal information. You can manage your communication preferences and request a copy of the data we hold about you.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">Contact Us</h2>
        <p>
          If you have any questions or concerns about our Privacy Policy, please contact our data protection officer at <a href="mailto:privacy@nyletravel.com" className="text-primary-600 hover:underline">privacy@nyletravel.com</a>.
        </p>
      </section>
    </div>
  );

  return (
    <BasicStaticPage 
      title="Privacy Policy" 
      subtitle="How we respect and protect your luxury travel data."
      content={content}
    />
  );
}
