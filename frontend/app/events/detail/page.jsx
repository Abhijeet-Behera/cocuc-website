import React, { Suspense } from 'react';
import EventDetailClient from './EventDetailClient';

export default function EventDetailPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EventDetailClient />
    </Suspense>
  );
}
