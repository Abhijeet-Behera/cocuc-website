import React from 'react';
import EventDetailClient from './EventDetailClient';
import { INITIAL_EVENTS } from '../../../lib/eventsStore';

export function generateStaticParams() {
  return INITIAL_EVENTS.map((event) => ({
    id: event.id,
  }));
}

export default async function EventDetailPage({ params }) {
  const resolvedParams = await params;
  return <EventDetailClient eventId={resolvedParams?.id} />;
}
