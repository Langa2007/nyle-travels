'use client';

import { useState, useEffect } from 'react';
import BasicStaticPage from '@/components/ui/BasicStaticPage';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { FiCheck, FiShield, FiBarChart2, FiSettings, FiTarget } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: false,
    analytical: false,
    marketing: false
  });

  useEffect(() => {
    setPreferences({
      essential: true,
      functional: Cookies.get('nyle_functional_cookies') === 'true',
      analytical: Cookies.get('nyle_analytical_cookies') === 'true',
      marketing: Cookies.get('nyle_marketing_cookies') === 'true'
    });
  }, []);

  const handleToggle = (type) => {
    if (type === 'essential') return;
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSave = () => {
    const expires = 365;
    Cookies.set('nyle_cookie_consent', 'accepted', { expires });
    
    if (preferences.functional) Cookies.set('nyle_functional_cookies', 'true', { expires });
    else Cookies.remove('nyle_functional_cookies');
    
    if (preferences.analytical) Cookies.set('nyle_analytical_cookies', 'true', { expires });
    else Cookies.remove('nyle_analytical_cookies');
    
    if (preferences.marketing) Cookies.set('nyle_marketing_cookies', 'true', { expires });
    else Cookies.remove('nyle_marketing_cookies');

    toast.success('Your preferences have been saved');
  };

  const cookieTypes = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      description: 'Necessary for the website to function correctly. They enable basic features like page navigation and access to secure areas of the website.',
      icon: FiShield,
      required: true
    },
    {
      id: 'functional',
      title: 'Functional Cookies',
      description: 'Enable the website to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personal features.',
      icon: FiSettings,
      required: false
    },
    {
      id: 'analytical',
      title: 'Analytical Cookies',
      description: 'Help us understand how visitors interact with the website by collecting and reporting information anonymously.',
      icon: FiBarChart2,
      required: false
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      description: 'Used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.',
      icon: FiTarget,
      required: false
    }
  ];

  const content = (
    <div className="space-y-12 pb-20">
      <section className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
        <h2 className="text-2xl font-serif text-gray-900 mb-4 font-bold">Your Privacy Choices</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          At Nyle Travel, we respect your privacy and give you control over your cookie preferences. 
          Use the toggles below to manage which types of cookies you want to allow. Essential cookies 
          cannot be disabled as they are required for the site to function.
        </p>

        <div className="space-y-4">
          {cookieTypes.map((type) => (
            <div 
              key={type.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  preferences[type.id] ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 text-gray-400'
                }`}>
                  <type.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    {type.title}
                    {type.required && (
                      <span className="text-[10px] uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Required</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-xl">{type.description}</p>
                </div>
              </div>

              <button
                onClick={() => handleToggle(type.id)}
                disabled={type.required}
                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                  preferences[type.id] ? 'bg-primary-500' : 'bg-gray-200'
                } ${type.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <motion.div
                  animate={{ x: preferences[type.id] ? 24 : 4 }}
                  className="absolute top-1 left-0 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center"
                >
                  {preferences[type.id] && <FiCheck className="text-primary-500" size={12} />}
                </motion.div>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSave}
            className="px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200"
          >
            Save Preferences
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section>
          <h2 className="text-3xl font-serif text-gray-900 mb-6 font-bold">What are Cookies?</h2>
          <p className="text-gray-600 leading-relaxed">
            Cookies are small text files that are placed on your device by websites that you visit. 
            They are widely used to make websites work, or work more efficiently, as well as to 
            provide information to the owners of the site.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-serif text-gray-900 mb-6 font-bold">More Information</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            If you have any questions about our use of cookies or other technologies, please 
            email us at <a href="mailto:privacy@nyletravel.com" className="text-primary-600 font-bold hover:underline">privacy@nyletravel.com</a>.
          </p>
          <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100">
            <p className="text-sm text-primary-800 italic">
              "We believe in complete transparency and give you full control over how your 
              data is used to provide you with the best luxury travel experience."
            </p>
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <BasicStaticPage 
      title="Cookies Preference Center" 
      subtitle="Manage your cookie settings to personalize your luxury journey."
      content={content}
    />
  );
}
