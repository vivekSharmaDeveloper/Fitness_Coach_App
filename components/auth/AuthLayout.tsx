import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}

export default function AuthLayout({ children, title, subtitle, footer }: AuthLayoutProps) {
  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">FC</span>
              </div>
            </Link>
            <h1 className="auth-form-title">{title}</h1>
            {subtitle && <p className="auth-form-subtitle">{subtitle}</p>}
          </div>

          <div className="mt-8 space-y-6">
            {children}
          </div>

          {footer && (
            <div className="mt-6 text-center">
              {footer}
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-indigo-900/70" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-white">
            <h2 className="text-4xl font-bold tracking-tight">
              Transform Your Fitness Journey
            </h2>
            <p className="mt-4 text-lg text-indigo-100">
              Join thousands of users who have achieved their fitness goals with our personalized coaching platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 