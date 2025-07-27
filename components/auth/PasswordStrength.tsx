import { Check, X } from 'lucide-react';

interface PasswordRequirement {
  text: string;
  regex: RegExp;
}

const requirements: PasswordRequirement[] = [
  { text: 'At least 8 characters', regex: /.{8,}/ },
  { text: 'At least one uppercase letter', regex: /[A-Z]/ },
  { text: 'At least one lowercase letter', regex: /[a-z]/ },
  { text: 'At least one number', regex: /[0-9]/ },
  { text: 'At least one special character', regex: /[!@#$%^&*(),.?":{}|<>]/ },
];

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const metRequirements = requirements.filter(req => req.regex.test(password));
  const strength = metRequirements.length / requirements.length;

  const getStrengthClass = () => {
    if (strength <= 0.4) return 'auth-password-strength-bar-weak';
    if (strength <= 0.7) return 'auth-password-strength-bar-medium';
    return 'auth-password-strength-bar-strong';
  };

  return (
    <div className="space-y-2">
      <div className="auth-password-strength">
        <div
          className={`auth-password-strength-bar ${getStrengthClass()}`}
          style={{ width: `${strength * 100}%` }}
        />
      </div>
      <div className="auth-password-requirements">
        {requirements.map((requirement, index) => {
          const isMet = requirement.regex.test(password);
          return (
            <div key={index} className="auth-password-requirement">
              {isMet ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-gray-400" />
              )}
              <span className={isMet ? 'auth-password-requirement-met' : 'auth-password-requirement-unmet'}>
                {requirement.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 