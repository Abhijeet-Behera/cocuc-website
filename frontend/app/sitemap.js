export const dynamic = 'force-static';

export default function sitemap() {
  const baseUrl = 'https://unionchurch.in';
  
  // List of all main routes
  const routes = [
    '',
    '/about',
    '/activities',
    '/contact-us',
    '/timings',
    '/prayer',
    '/gallery',
    '/pastors-note',
    '/feedback',
    '/privacy-policy',
    '/terms-of-service',
    '/disclaimer',
    '/data-deletion'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/activities' || route === '/prayer' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
