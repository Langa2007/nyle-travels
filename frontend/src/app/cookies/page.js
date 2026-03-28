'use client';

import BasicStaticPage from '@/components/ui/BasicStaticPage';

export default function CookiesPage() {
  const content = (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">What are Cookies?</h2>
        <p>
          Cookies are small pieces of data that we store on your computer when you visit our website. They help us to provide you with a more personalized experience and enable certain features to work.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">How We Use Cookies</h2>
        <p>
          We use cookies for a variety of purposes related to your luxury travel experience, including:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Authentication and session management.</li>
          <li>Performance and analytics to improve our website.</li>
          <li>Personalization and marketing to provide you with tailored content and offers.</li>
          <li>Securely processing your bookings and payments.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">Your Choices</h2>
        <p>
          You have the right to control the use of cookies on our website. You can manage your cookie preferences through our cookie consent banner and your browser settings.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">More Information</h2>
        <p>
          For more information about our cookie policy, please contact our data protection officer at <a href="mailto:privacy@nyletravel.com" className="text-primary-600 hover:underline">privacy@nyletravel.com</a>.
        </p>
      </section>
    </div>
  );

  return (
    <BasicStaticPage 
      title="Cookies Policy" 
      subtitle="How we use cookies to enhance your luxury travel experience."
      content={content}
    />
  );
}
