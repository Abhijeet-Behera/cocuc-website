import React, { Suspense } from 'react'
import PrayerZonesClient from './PrayerZonesClient'

export const metadata = {
  title: 'Prayer Zones | Church of Christ Union Church Bhubaneswar',
  description:
    'Explore the 16 Official Prayer Zones of Church of Christ Union Church Bhubaneswar, connecting every locality and fellowship through intercessory prayer and pastoral care.',
}

export default function PrayerZonesPage() {
  return (
    <Suspense fallback={<div style={{ padding: '5rem', textStyle: 'center', color: '#fff' }}>Loading Prayer Zones...</div>}>
      <PrayerZonesClient />
    </Suspense>
  )
}
