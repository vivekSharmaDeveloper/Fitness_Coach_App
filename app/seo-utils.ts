import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  type?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    path = '/',
    type = 'website',
    image = '/og-image.jpg',
    noIndex = false
  } = config;

  const url = `https://fitcoach.app${path}`;

  return {
    title: {
      default: title,
      template: '%s | FitCoach - AI Fitness Coach'
    },
    description,
    keywords: [
      'fitness coach',
      'AI fitness',
      'personal trainer',
      'workout plans',
      'wellness coach',
      ...keywords
    ],
    metadataBase: new URL('https://fitcoach.app'),
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      locale: 'en_US',
      url,
      title,
      description,
      siteName: 'FitCoach',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@fitcoach',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Pre-defined metadata for common pages
export const pageMetadata = {
  home: generateMetadata({
    title: 'FitCoach - Your Personal AI Fitness & Wellness Coach',
    description: 'Transform your health with FitCoach - an AI-powered personal fitness and wellness coach. Get personalized workout plans, nutrition guidance, and achieve your fitness goals.',
    keywords: ['AI fitness coach', 'personalized workouts', 'smart fitness goals'],
    path: '/'
  }),

  dashboard: generateMetadata({
    title: 'Dashboard - Track Your Fitness Progress',
    description: 'Monitor your fitness journey with personalized analytics, goal tracking, and progress insights. Stay motivated with your AI fitness coach.',
    keywords: ['fitness dashboard', 'progress tracking', 'goal monitoring'],
    path: '/dashboard'
  }),

  onboarding: generateMetadata({
    title: 'Get Started - Personalized Fitness Onboarding',
    description: 'Complete your personalized fitness assessment to receive AI-powered workout plans and nutrition guidance tailored to your goals.',
    keywords: ['fitness assessment', 'personalized workout', 'health questionnaire'],
    path: '/onboarding'
  }),

  goals: generateMetadata({
    title: 'My Fitness Goals - Smart Goal Setting',
    description: 'Create, track, and achieve your fitness goals with SMART goal methodology and AI-powered recommendations.',
    keywords: ['SMART goals', 'fitness goals', 'goal tracking', 'workout planning'],
    path: '/goals'
  }),

  login: generateMetadata({
    title: 'Sign In - Access Your Fitness Dashboard',
    description: 'Sign in to access your personalized fitness dashboard, track progress, and continue your wellness journey.',
    keywords: ['login', 'sign in', 'fitness account'],
    path: '/login',
    noIndex: true
  }),

  signup: generateMetadata({
    title: 'Join FitCoach - Start Your Fitness Journey',
    description: 'Create your free FitCoach account and begin your personalized fitness journey with AI-powered coaching and smart goal tracking.',
    keywords: ['sign up', 'create account', 'join fitness coach'],
    path: '/signup'
  }),

  profile: generateMetadata({
    title: 'Profile Settings - Customize Your Experience',
    description: 'Manage your profile, update preferences, and customize your FitCoach experience for better personalized recommendations.',
    keywords: ['profile settings', 'account settings', 'preferences'],
    path: '/profile',
    noIndex: true
  })
};
