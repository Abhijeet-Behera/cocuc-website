import React from 'react';
import WingClient from './WingClient';
import { DEFAULT_WINGS } from '../../../../types/events';

export function generateStaticParams() {
  return DEFAULT_WINGS.map((wing) => ({
    slug: wing.slug,
  }));
}

export default async function WingPage({ params }) {
  const resolvedParams = await params;
  return <WingClient slug={resolvedParams?.slug} />;
}
