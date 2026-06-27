/**
 * JSON-LD 結構化資料（SEO Phase 3）
 */
export function useJsonLd(data: Record<string, unknown>) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(data),
      },
    ],
  })
}

export function buildLocalBusinessSchema(name: string, location: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `WanderLens — ${name}`,
    description: `在 ${location} 的專業隨選攝影服務`,
    url,
    areaServed: { '@type': 'Place', name: location },
    provider: { '@type': 'Organization', name: 'WanderLens' },
  }
}

export function buildServiceSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: { '@type': 'Organization', name: 'WanderLens' },
  }
}
