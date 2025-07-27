'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AtSign, Lock, Github } from 'lucide-react';
import { signIn } from 'next-auth/react';
import AuthLayout from '../../../components/auth/AuthLayout';
import { AuthInput } from '../../../components/auth/AuthInput';
import { AuthButton } from '../../../components/auth/AuthButton';
import { SocialLoginButton } from '../../../components/auth/SocialLoginButton';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      footer={
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="auth-link">
            Sign up
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          icon={AtSign}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          autoComplete="email"
          error={error}
        />

        <AuthInput
          id="password"
          name="password"
          type="password"
          label="Password"
          icon={Lock}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          autoComplete="current-password"
          showPasswordToggle
        />

        <div className="flex items-center justify-between">
          <div className="auth-checkbox-wrapper">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="auth-checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            />
            <label htmlFor="remember-me" className="auth-checkbox-label">
              Remember me
            </label>
          </div>

          <Link href="/forgot-password" className="auth-link text-sm">
            Forgot your password?
          </Link>
        </div>

        <AuthButton type="submit" loading={isLoading} fullWidth>
          Sign in
        </AuthButton>

        <div className="auth-divider">
          <div className="auth-divider-line">
            <div className="auth-divider-line-inner" />
          </div>
          <div className="auth-divider-text">
            <span className="auth-divider-text-inner">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <SocialLoginButton
            provider="GitHub"
            icon={Github}
            onClick={() => handleSocialLogin('github')}
            loading={isLoading}
          />
        </div>
      </form>
    </AuthLayout>
  );
} 