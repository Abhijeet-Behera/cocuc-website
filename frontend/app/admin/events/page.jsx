'use client';

import React from 'react';
import AdminEventUploader from '../../../components/admin/AdminEventUploader';
import PageHeader from '../../../components/PageHeader';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminEventsPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '5rem' }}>
      {/* Top Banner */}
      <PageHeader
        category="Admin Management"
        title="Events & Wing Association"
        description="Upload wing announcements, manage 1000-word descriptions, and auto-parse Google Drive photo galleries."
      />

      <div className="container" style={{ maxWidth: '1200px', margin: '1.5rem auto 0 auto', padding: '0 1.5rem' }}>
        <Link
          href="/events"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.9rem',
            color: '#64748b',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Bus Topology Event Viewer</span>
        </Link>
      </div>

      <AdminEventUploader />
    </main>
  );
}
