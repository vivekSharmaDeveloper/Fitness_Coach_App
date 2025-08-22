import fs from 'fs';
import path from 'path';

export interface EmailTemplate {
  subject: string;
  template: string;
  variables: Record<string, any>;
}

// Template replacement function
function replaceVariables(template: string, variables: Record<string, any>): string {
  let result = template;
  
  // Replace {{variable}} with actual values
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value || ''));
  });
  
  return result;
}

// Load and compile template
export function loadTemplate(templateName: string, variables: Record<string, any>): string {
  try {
    const templatePath = path.join(process.cwd(), 'lib', 'email-templates', `${templateName}.mjml`);
    const basePath = path.join(process.cwd(), 'lib', 'email-templates', 'base.mjml');
    
    // Read template files
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const baseTemplate = fs.readFileSync(basePath, 'utf-8');
    
    // Replace content placeholder in base template
    const finalTemplate = baseTemplate.replace('{{content}}', templateContent);
    
    // Replace all variables
    const compiledTemplate = replaceVariables(finalTemplate, variables);
    
    return compiledTemplate;
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    throw new Error(`Failed to load email template: ${templateName}`);
  }
}

// Welcome email template
export function getWelcomeEmailTemplate(name: string, loginUrl: string): EmailTemplate {
  const variables = {
    preview: 'Welcome to Fitness Coach! Start your fitness journey today.',
    name,
    loginUrl,
  };

  return {
    subject: '🎉 Welcome to Fitness Coach!',
    template: loadTemplate('welcome', variables),
    variables,
  };
}

// Forgot password email template
export function getForgotPasswordEmailTemplate(
  name: string, 
  resetUrl: string, 
  expirationTime: string
): EmailTemplate {
  const variables = {
    preview: 'Reset your Fitness Coach password securely.',
    name,
    resetUrl,
    expirationTime,
  };

  return {
    subject: '🔐 Reset Your Fitness Coach Password',
    template: loadTemplate('forgot-password', variables),
    variables,
  };
}

// Password reset confirmation email template
export function getPasswordResetConfirmationTemplate(name: string, loginUrl: string): EmailTemplate {
  const resetDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const variables = {
    preview: 'Your Fitness Coach password has been successfully reset.',
    name,
    loginUrl,
    resetDate,
  };

  return {
    subject: '✅ Password Reset Successful',
    template: loadTemplate('password-reset-confirmation', variables),
    variables,
  };
}

