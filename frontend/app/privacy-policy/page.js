import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Church of Christ (Union Church)',
  description: 'Privacy Policy for Church of Christ (Union Church), Bhubaneswar.',
};

export default function PrivacyPolicy() {
  return (
    <div className="section" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '2rem', textAlign: 'left' }}>Privacy Policy</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.9 }}>
          <p><strong>Last Updated: June 2026</strong></p>
          
          <p>
            Welcome to the Church of Christ (Union Church) website. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '1rem' }}>1. Information We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you, including:
          </p>
          <ul style={{ marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong>Identity Data</strong> includes first name, last name, or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address and telephone numbers (e.g., when you submit a prayer request or contact form).</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location.</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '1rem' }}>2. How We Use Your Data</h2>
          <p>
            We will only use your personal data for the purposes for which we collected it, such as:
          </p>
          <ul style={{ marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>To respond to your inquiries or prayer requests.</li>
            <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
            <li>To administer and protect our website.</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '1rem' }}>3. Data Security</h2>
          <p>
            We have put in place appropriate security measures (including SSL encryption) to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '1rem' }}>4. Third-Party Links</h2>
          <p>
            This website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '1rem' }}>5. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
            <br/><br/>
            <strong>Church of Christ (Union Church)</strong><br/>
            Lokseva Marg, Unit-4, PO Box 751001<br/>
            Bhubaneswar, Odisha, India<br/>
            Email: <a href="mailto:pastor@unionchurch.in" style={{ color: 'var(--color-primary)' }}>pastor@unionchurch.in</a> or <a href="mailto:secretary@unionchurch.org.in" style={{ color: 'var(--color-primary)' }}>secretary@unionchurch.org.in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
