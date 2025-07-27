import { LucideIcon } from 'lucide-react';

interface SocialLoginButtonProps {
  provider: string;
  icon: LucideIcon;
  onClick: () => void;
  loading?: boolean;
}

export function SocialLoginButton({ provider, icon: Icon, onClick, loading = false }: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="auth-social-button"
      aria-label={`Sign in with ${provider}`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="ml-2">Continue with {provider}</span>
    </button>
  );
} 