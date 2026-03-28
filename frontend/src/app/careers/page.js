'use client';

import BasicStaticPage from '@/components/ui/BasicStaticPage';
import Button from '@/components/ui/Button';

export default function CareersPage() {
  const content = (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">Join the Nyle Travel Team</h2>
        <p>
          At Nyle Travel, we are passionate about creating extraordinary African experiences. We are always looking for talented and dedicated individuals who share our vision of luxury travel and conservation.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">Our Culture</h2>
        <p>
          We pride ourselves on our collaborative and inclusive culture. We offer a fast-paced and challenging environment where you can grow your career and make a real impact on African tourism.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6">Current Openings</h2>
        <div className="space-y-6">
          {[
            { title: 'Luxury Travel Consultant', location: 'Nairobi, Kenya', type: 'Full-time' },
            { title: 'Specialist Safari Guide', location: 'Maasai Mara, Kenya', type: 'Contract' },
            { title: 'Digital Marketing Manager', location: 'Remote / Nairobi', type: 'Full-time' },
            { title: 'Customer Experience Lead', location: 'Nairobi, Kenya', type: 'Full-time' },
          ].map((job, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between group hover:bg-white hover:shadow-xl transition-all duration-300">
              <div>
                <h4 className="text-xl font-serif text-gray-900 mb-1">{job.title}</h4>
                <p className="text-sm text-gray-500 uppercase tracking-widest">{job.location} • {job.type}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4 md:mt-0">
                Apply Now
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary-50 p-12 rounded-[40px] text-center">
        <h3 className="text-2xl font-serif text-gray-900 mb-4">Don't see a fit?</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We are always interested in meeting exceptional talent. Send us your CV and a cover letter, and we'll keep you in mind for future opportunities.
        </p>
        <Button variant="primary">
          Send Spontaneous Application
        </Button>
      </section>
    </div>
  );

  return (
    <BasicStaticPage 
      title="Careers" 
      subtitle="Shape the future of luxury travel in Africa with us."
      content={content}
    />
  );
}
