import React from 'react';

export const metadata = {
  title: 'Disclaimer | Church of Christ (Union Church)',
  description: 'Disclaimer for Church of Christ (Union Church), Bhubaneswar.',
};

export default function Disclaimer() {
  return (
    <div className="section" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '2rem', textAlign: 'left' }}>Disclaimer</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.9 }}>
          <p><strong>Last Updated: June 2026</strong></p>
          
          <p>
            The information contained on the Church of Christ (Union Church) website is for general information purposes only.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '1rem' }}>General Disclaimer</h2>
          <p>
            Church of Christ (Union Church) assumes no responsibility for errors or omissions in the contents on the Service. In no event shall Church of Christ (Union Church) be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service. 
          </p>
          <p>
            Church of Christ (Union Church) reserves the right to make additions, deletions, or modification to the contents on the Service at any time without prior notice.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '1rem' }}>External Links Disclaimer</h2>
          <p>
            The Church of Christ (Union Church) website may contain links to external websites that are not provided or maintained by or in any way affiliated with Church of Christ (Union Church). Please note that Church of Christ (Union Church) does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '1rem' }}>Fair Use Notice</h2>
          <p>
            This website may contain copyrighted material the use of which has not always been specifically authorized by the copyright owner. We are making such material available for educational and religious purposes.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '1rem' }}>Contact Us</h2>
          <p>
            If you have any questions about this Disclaimer, please contact us at: <a href="mailto:pastor@unionchurch.in" style={{ color: 'var(--color-primary)' }}>pastor@unionchurch.in</a> or <a href="mailto:secretary@unionchurch.org.in" style={{ color: 'var(--color-primary)' }}>secretary@unionchurch.org.in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
