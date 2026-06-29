import React from 'react';

export const metadata = {
  title: 'Terms of Service | Church of Christ (Union Church)',
  description: 'Terms of Service for Church of Christ (Union Church), Bhubaneswar.',
};

export default function TermsOfService() {
  return (
    <div className="section" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '2rem', textAlign: 'left' }}>Terms of Service</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.9 }}>
          <p><strong>Last Updated: June 2026</strong></p>
          
          <p>
            Welcome to the Church of Christ (Union Church) website. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions of use.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '1rem' }}>1. Acceptance of Terms</h2>
          <p>
            By accessing this website, you agree to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '1rem' }}>2. Disclaimer</h2>
          <p>
            The materials on the Church of Christ (Union Church) website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '1rem' }}>3. Limitations</h2>
          <p>
            In no event shall Church of Christ (Union Church) or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '1rem' }}>4. Revisions and Errata</h2>
          <p>
            The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '1rem' }}>5. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at: pastor@unionchurch.in or secretary@unionchurch.in
          </p>
        </div>
      </div>
    </div>
  );
}
