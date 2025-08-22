'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AtSign, Lock, User, Github } from 'lucide-react';
import { signIn } from 'next-auth/react';
import AuthLayout from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { SocialLoginButton } from '@/components/auth/SocialLoginButton';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError('');
    setPasswordError('');

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const requestData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const data = await response.json();
        
        // Handle specific error messages
        if (data.message && data.message.includes('already exists')) {
          toast.error('User with this email already exists', {
            position: 'top-right',
            style: {
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626'
            }
          });
          setEmailError('User with this email already exists');
        } else {
          toast.error(data.message || 'Something went wrong', {
            position: 'top-right'
          });
        }
        return;
      }

      const data = await response.json();
      
      // Show success toast
      toast.success('Account created successfully!', {
        position: 'top-right'
      });
      
      // Now try to sign in the user automatically
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // If auto-login fails, redirect to login page
        toast.success('Please log in to continue', {
          position: 'top-right'
        });
        router.push('/login');
        return;
      }

      // Auto-login successful, redirect to onboarding or dashboard
      router.push('/onboarding');
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.', {
        position: 'top-right'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      toast.error('An error occurred. Please try again.', {
        position: 'top-right'
      });
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join our fitness community today"
      footer={
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          id="name"
          name="name"
          type="text"
          label="Full name"
          icon={User}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          autoComplete="name"
        />

        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          icon={AtSign}
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            // Clear email error when user starts typing
            if (emailError) {
              setEmailError('');
            }
          }}
          required
          autoComplete="email"
          error={emailError}
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
          autoComplete="new-password"
          showPasswordToggle
        />

        {formData.password && <PasswordStrength password={formData.password} />}

        <AuthInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={(e) => {
            setFormData({ ...formData, confirmPassword: e.target.value });
            // Clear password error when user starts typing
            if (passwordError) {
              setPasswordError('');
            }
          }}
          required
          autoComplete="new-password"
          showPasswordToggle
          error={passwordError}
        />

        <div className="auth-checkbox-wrapper">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="auth-checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
            required
          />
          <label htmlFor="terms" className="auth-checkbox-label">
            I agree to the{' '}
            <Link href="/terms" className="auth-link">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="auth-link">
              Privacy Policy
            </Link>
          </label>
        </div>

        <AuthButton type="submit" loading={isLoading} fullWidth>
          Create account
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