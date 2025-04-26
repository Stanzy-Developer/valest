import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Valest - Payer en Bitcoin',
    short_name: 'Valest',
    description: 'The fastest way, the easiest path.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/VALEST.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}