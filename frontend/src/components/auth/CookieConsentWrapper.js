'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function CookieConsentWrapper({ children }) {
  const [consent, setConsent] = useState(false);
  
  useEffect(() => {
    const checkConsent = () => {
      const analyticalConsent = Cookies.get('nyle_analytical_cookies') === 'true';
      setConsent(analyticalConsent);
    };

    checkConsent();
    // Also check every few seconds in case they change it in another tab
    const interval = setInterval(checkConsent, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!consent) return null;
  return children;
}
