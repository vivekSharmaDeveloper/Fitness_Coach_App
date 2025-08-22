import { ReactNode } from 'react';

interface SemanticPageProps {
  children: ReactNode;
  className?: string;
}

interface SemanticSectionProps {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export function SemanticPage({ children, className = '' }: SemanticPageProps) {
  return (
    <main role="main" className={`min-h-screen ${className}`}>
      {children}
    </main>
  );
}

export function SemanticSection({ 
  children, 
  className = '', 
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy 
}: SemanticSectionProps) {
  return (
    <section 
      className={className}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </section>
  );
}

export function SemanticArticle({ children, className = '' }: SemanticPageProps) {
  return (
    <article className={className}>
      {children}
    </article>
  );
}

export function SemanticAside({ children, className = '' }: SemanticPageProps) {
  return (
    <aside className={className} role="complementary">
      {children}
    </aside>
  );
}

interface SemanticHeaderProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SemanticHeader({ level, children, className = '', id }: SemanticHeaderProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag className={className} id={id}>
      {children}
    </Tag>
  );
}

// Navigation component with proper ARIA
interface SemanticNavProps {
  children: ReactNode;
  className?: string;
  'aria-label': string;
}

export function SemanticNav({ children, className = '', 'aria-label': ariaLabel }: SemanticNavProps) {
  return (
    <nav className={className} aria-label={ariaLabel} role="navigation">
      {children}
    </nav>
  );
}

// Breadcrumb component for better navigation structure
interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg 
                className="w-4 h-4 mx-2 text-muted-foreground/50" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {item.current ? (
              <span aria-current="page" className="font-medium text-foreground">
                {item.label}
              </span>
            ) : item.href ? (
              <a 
                href={item.href} 
                className="hover:text-foreground transition-colors"
                aria-label={`Go to ${item.label}`}
              >
                {item.label}
              </a>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Skip to content link for accessibility
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 transition-all"
    >
      Skip to main content
    </a>
  );
}
