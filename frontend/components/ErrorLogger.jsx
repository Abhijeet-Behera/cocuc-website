'use client';

import { useEffect, useState } from 'react';

export default function ErrorLogger() {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const handleError = (event) => {
      const errorMsg = event.error ? event.error.stack || event.error.message : event.message;
      setErrors((prev) => [...prev, `Error: ${errorMsg}`]);
    };

    const handleRejection = (event) => {
      const reason = event.reason ? event.reason.stack || event.reason.message || String(event.reason) : 'Unhandled Rejection';
      setErrors((prev) => [...prev, `Promise Rejection: ${reason}`]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  if (errors.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ff3333',
      color: '#ffffff',
      padding: '20px',
      zIndex: 100000,
      maxHeight: '50vh',
      overflowY: 'auto',
      fontFamily: 'monospace',
      fontSize: '14px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      borderBottom: '5px solid #800000'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold' }}>🚨 Client-Side JavaScript Errors Detected:</h3>
      <ol style={{ margin: 0, paddingLeft: '20px' }}>
        {errors.map((err, i) => (
          <li key={i} style={{ marginBottom: '10px', whiteSpace: 'pre-wrap' }}>{err}</li>
        ))}
      </ol>
      <button 
        onClick={() => setErrors([])} 
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#ffffff',
          color: '#ff3333',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Dismiss
      </button>
    </div>
  );
}
