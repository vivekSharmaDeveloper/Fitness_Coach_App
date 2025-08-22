import Script from 'next/script';

// Organization Schema
export function OrganizationSchema() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FitCoach",
    "description": "AI-powered personal fitness and wellness coaching platform",
    "url": "https://fitcoach.app",
    "logo": {
      "@type": "ImageObject",
      "url": "https://fitcoach.app/logo.png"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-FITNESS",
      "contactType": "customer service",
      "email": "support@fitcoach.app"
    },
    "sameAs": [
      "https://twitter.com/fitcoach",
      "https://facebook.com/fitcoach",
      "https://instagram.com/fitcoach"
    ]
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationData)
      }}
    />
  );
}

// WebApplication Schema
export function WebApplicationSchema() {
  const webAppData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FitCoach - AI Fitness Coach",
    "description": "Transform your health with AI-powered personal fitness coaching. Get customized workout plans, nutrition guidance, and achieve your wellness goals.",
    "url": "https://fitcoach.app",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "FitCoach"
    },
    "datePublished": "2025-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250"
    }
  };

  return (
    <Script
      id="webapp-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(webAppData)
      }}
    />
  );
}

// FAQ Schema for common questions
export function FAQSchema() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does AI fitness coaching work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI analyzes your fitness goals, current activity level, and preferences to create personalized workout plans and nutrition recommendations. The system adapts as you progress and provides real-time guidance."
        }
      },
      {
        "@type": "Question",
        "name": "Is FitCoach suitable for beginners?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! FitCoach is designed for all fitness levels. Our onboarding process assesses your current fitness level and creates beginner-friendly plans that gradually increase in intensity as you improve."
        }
      },
      {
        "@type": "Question",
        "name": "How do I track my progress?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FitCoach provides comprehensive progress tracking through your dashboard. You can log workouts, track measurements, monitor goal completion, and view detailed analytics of your fitness journey."
        }
      },
      {
        "@type": "Question",
        "name": "Can I customize my workout plans?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! While our AI creates personalized plans based on your preferences, you can further customize workouts, set specific goals, and adjust difficulty levels to match your needs and schedule."
        }
      }
    ]
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData)
      }}
    />
  );
}

// How-to Schema for fitness guidance
interface HowToStepProps {
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
  title: string;
  description: string;
}

export function HowToSchema({ steps, title, description }: HowToStepProps) {
  const howToData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && {
        "image": {
          "@type": "ImageObject",
          "url": step.image
        }
      })
    }))
  };

  return (
    <Script
      id="howto-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(howToData)
      }}
    />
  );
}

// Article Schema for blog posts or guides
interface ArticleSchemaProps {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}

export function ArticleSchema({ 
  headline, 
  description, 
  author, 
  datePublished, 
  dateModified, 
  image, 
  url 
}: ArticleSchemaProps) {
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "FitCoach",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fitcoach.app/logo.png"
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    ...(image && {
      "image": {
        "@type": "ImageObject",
        "url": image
      }
    })
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleData)
      }}
    />
  );
}

// Breadcrumb Schema
interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbData)
      }}
    />
  );
}
