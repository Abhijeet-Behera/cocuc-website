import React from 'react';

export const metadata = {
  title: 'Worship Timings | Church of Christ - Union Church',
  description: 'Join us for Sunday worship at Church of Christ (Union Church), Bhubaneswar. English worship at 9:30 AM and Odia worship at 3:30 PM. Discover our full schedule.',
  keywords: ['Church timings Bhubaneswar', 'Sunday service Bhubaneswar', 'English worship Bhubaneswar', 'Odia worship service', 'Union Church timings'],
};

export default function Timings() {
  return (
    <div className="section" style={{ paddingTop: '8rem', backgroundColor: 'var(--color-surface)' }}>
      <div className="container">
        <h1 className="section-title-elegant" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <span className="title-normal">Church </span>
          <em className="title-italic">Timings</em>
        </h1>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2.5rem', 
          maxWidth: '700px', 
          margin: '0 auto',
          backgroundColor: 'var(--color-white)',
          padding: '3.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', marginBottom: '1.2rem', borderBottom: '2px solid rgba(128, 0, 0, 0.1)', paddingBottom: '0.6rem', fontFamily: 'var(--font-heading)' }}>
              Sunday Worship
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.1rem', opacity: 0.9 }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <strong>English Worship:</strong> <span>9:30 AM</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <strong>Odia Worship:</strong> <span>3:30 PM</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <strong>Sunday School:</strong> <span>8:00 AM</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', marginBottom: '1.2rem', borderBottom: '2px solid rgba(128, 0, 0, 0.1)', paddingBottom: '0.6rem', fontFamily: 'var(--font-heading)' }}>
              Every Saturday
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.1rem', opacity: 0.9 }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <strong>Women's Fellowship:</strong> <span>4:30 PM</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <strong>Baptism Class:</strong> <span>4:00 PM</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <strong>Youth Fellowship:</strong> <span>5:30 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
