import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ children, loading = false, fullWidth = false, variant = 'primary', icon, className = '', ...props }, ref) => {
    const baseClasses = 'auth-button';
    const variantClasses = {
      primary: '',
      secondary: 'auth-button-secondary',
      outline: 'bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-900/20',
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <div className="flex items-center justify-center space-x-2">
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
          </div>
        )}
      </button>
    );
  }
);

AuthButton.displayName = 'AuthButton';
