import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HomePage from '../../app/page';

// Mock the modules
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('HomePage', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      refresh: jest.fn(),
    } as any);
    jest.clearAllMocks();
  });

  it('shows loading spinner while session is loading', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
    } as any);

    render(<HomePage />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
    expect(spinner).toHaveClass('rounded-full');
  });

  it('redirects to dashboard when user is authenticated', () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated',
    } as any);

    render(<HomePage />);
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows landing page when user is not authenticated', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    } as any);

    render(<HomePage />);
    
    expect(screen.getByText('Transform Your')).toBeInTheDocument();
    expect(screen.getByText('Fitness Journey')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('contains correct links for get started and sign in', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    } as any);

    render(<HomePage />);
    
    const getStartedLink = screen.getByRole('link', { name: 'Get Started' });
    const signInLink = screen.getByRole('link', { name: 'Sign In' });
    
    expect(getStartedLink).toHaveAttribute('href', '/signup');
    expect(signInLink).toHaveAttribute('href', '/login');
  });

  it('displays fitness coach branding', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    } as any);

    render(<HomePage />);
    
    expect(screen.getByText('Your Fitness Coach')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Goal Setting')).toBeInTheDocument();
    expect(screen.getByText('💪')).toBeInTheDocument();
  });
});
