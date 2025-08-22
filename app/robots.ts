import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/signup', '/onboarding', '/privacy', '/terms'],
        disallow: [
          '/api/',
          '/dashboard/',
          '/goals/',
          '/my-stats/',
          '/profile/',
          '/login',
          '/auth/',
          '/forgot-password',
          '/test-auth'
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/'],
      },
    ],
    sitemap: 'https://fitcoach.app/sitemap.xml',
    host: 'https://fitcoach.app',
  }
}
