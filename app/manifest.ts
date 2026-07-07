import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kay Ndeki',
    short_name: 'Kay Ndeki',
    description: 'Votre petit-déjeuner livré partout à Dakar.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1A56DB',
    icons: [
      {
        src: '/icon.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/icon.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}
