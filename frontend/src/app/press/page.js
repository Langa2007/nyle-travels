'use client';

import BasicStaticPage from '@/components/ui/BasicStaticPage';
import Button from '@/components/ui/Button';

export default function PressPage() {
  const content = (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">Media Outreach</h2>
        <p>
          At Nyle Travel, we are committed to sharing Africa's raw beauty with the world. We are always happy to connect with journalists, editors, and digital creators who are looking for unique and inspiring stories.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">Recent Press Releases</h2>
        <div className="space-y-6">
          {[
            { title: 'Nyle Travel Wins World Travel Awards 2023', date: 'March 15, 2024' },
            { title: 'Nyle Travel Announces New Sustainability Partner', date: 'March 10, 2024' },
            { title: 'Nyle Travel Launches Interactive Destination Guide', date: 'March 5, 2024' },
            { title: 'Nyle Travel Expands Luxury Safari Portfolio', date: 'February 28, 2024' },
          ].map((press, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between group hover:bg-white hover:shadow-xl transition-all duration-300">
              <div>
                <h4 className="text-xl font-serif text-gray-900 mb-1">{press.title}</h4>
                <p className="text-sm text-gray-500 uppercase tracking-widest">{press.date}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4 md:mt-0">
                Download PDF
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary-50 p-12 rounded-[40px] text-center">
        <h3 className="text-2xl font-serif text-gray-900 mb-4">Are you a journalist?</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We are always happy to connect with media professionals. Send us your inquiry and we'll get back to you with the information you need.
        </p>
        <Button variant="primary">
          Contact Press Team
        </Button>
      </section>
    </div>
  );

  return (
    <BasicStaticPage 
      title="Press" 
      subtitle="Insights, news, and inspiration for your next African adventure."
      content={content}
    />
  );
}
