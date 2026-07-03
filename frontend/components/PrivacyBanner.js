'use client';

import { useState, useEffect } from 'react';

export default function PrivacyBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const hasConsented = localStorage.getItem('dpdp_consent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('dpdp_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 9999,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.5)'
    }}>
      <p style={{ margin: 0, fontSize: '0.9rem', flex: 1 }}>
        We value your privacy. We don't collect personal data unnecessarily. By continuing to use our site, you agree to our <a href="/privacy-policy" style={{ textDecoration: 'underline', color: '#4da6ff' }}>Privacy Policy</a>.
      </p>
      <button 
        onClick={handleAccept} 
        style={{
          marginLeft: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#4da6ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Got it
      </button>
    </div>
  );
}
