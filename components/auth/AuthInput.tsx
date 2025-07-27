import { LucideIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label: string;
  error?: string;
  success?: string;
  showPasswordToggle?: boolean;
  onPasswordToggle?: () => void;
  showPassword?: boolean;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ icon: Icon, label, error, success, showPasswordToggle, onPasswordToggle, showPassword: externalShowPassword, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalShowPassword, setInternalShowPassword] = useState(false);
    
    const showPassword = externalShowPassword !== undefined ? externalShowPassword : internalShowPassword;
    const handlePasswordToggle = onPasswordToggle || (() => setInternalShowPassword(!internalShowPassword));

    return (
      <div className="space-y-1">
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <div className={`auth-input-wrapper ${isFocused ? 'ring-2 ring-indigo-500 ring-opacity-50 rounded-xl' : ''}`}>
          <div className="auth-input-icon">
            <Icon className="h-5 w-5" />
          </div>
          <input
            ref={ref}
            className={`auth-input ${error ? 'auth-input-error' : ''} ${success ? 'auth-input-success' : ''} ${className}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
            type={showPasswordToggle ? (showPassword ? 'text' : 'password') : props.type}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={handlePasswordToggle}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          )}
        </div>
        {error && <p className="auth-error-message">{error}</p>}
        {success && <p className="auth-success-message">{success}</p>}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
