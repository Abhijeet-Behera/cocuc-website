'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import BusTopologyView from '../../components/events/BusTopologyView';
import { DEFAULT_WINGS } from '../../types/events';
import { INITIAL_EVENTS } from '../../lib/eventsStore';

export default function EventsPage() {
  const [wings] = useState(DEFAULT_WINGS);
  const [events, setEvents] = useState(INITIAL_EVENTS);

  // Fetch live events from API
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setEvents(data.data);
          }
        }
      } catch (err) {
        console.warn('[EventsPage] Fallback to initial events cache:', err);
      }
    }
    loadEvents();
  }, []);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Page Hero Header */}
      <PageHeader
        category="Ministries & Fellowships"
        title="Events & Wing Topology"
        description="Explore the vibrant life and active ministries of Church of Christ Union Church Bhubaneswar through our interactive horizontal bus topology."
      />

      {/* Main Bus Topology Component (Clicking a wing directly opens its dedicated page) */}
      <BusTopologyView
        wings={wings}
        events={events}
      />
    </main>
  );
}
