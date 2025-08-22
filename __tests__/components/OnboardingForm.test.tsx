import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingForm, OnboardingData } from '../../components/onboarding/OnboardingForm';

// Mock fetch
global.fetch = jest.fn();

const mockOnComplete = jest.fn();

describe('OnboardingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  it('renders the first step by default', () => {
    render(<OnboardingForm onComplete={mockOnComplete} />);
    
    expect(screen.getByText('Step 1 of 7')).toBeInTheDocument();
  });

  it('can navigate between steps', async () => {
    render(<OnboardingForm onComplete={mockOnComplete} />);
    
    const nextButton = screen.getByText('Next');
    await userEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText('Step 2 of 7')).toBeInTheDocument();
    });
  });

  it('can go back to previous step', async () => {
    render(<OnboardingForm onComplete={mockOnComplete} />);
    
    // Go to step 2
    const nextButton = screen.getByText('Next');
    await userEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText('Step 2 of 7')).toBeInTheDocument();
    });
    
    // Go back to step 1
    const prevButton = screen.getByText('Previous');
    await userEvent.click(prevButton);
    
    await waitFor(() => {
      expect(screen.getByText('Step 1 of 7')).toBeInTheDocument();
    });
  });

  it('shows AI recommendations button on final step', async () => {
    render(<OnboardingForm onComplete={mockOnComplete} />);
    
    // Navigate to final step
    for (let i = 0; i < 6; i++) {
      const nextButton = screen.getByText('Next');
      await userEvent.click(nextButton);
      await waitFor(() => {});
    }
    
    await waitFor(() => {
      expect(screen.getByText('Step 7 of 7')).toBeInTheDocument();
      expect(screen.getByText('✨ Get AI Recommendations')).toBeInTheDocument();
    });
  });

  it('fetches AI recommendations when button is clicked', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          goals: [
            {
              _id: 'test-1',
              title: 'Test Goal',
              category: 'fitness',
              description: 'Test description',
              plan: 'Test plan',
              reasoning: 'Test reasoning',
            },
          ],
        }),
      });

    render(<OnboardingForm onComplete={mockOnComplete} />);
    
    // Navigate to final step
    for (let i = 0; i < 6; i++) {
      const nextButton = screen.getByText('Next');
      await userEvent.click(nextButton);
      await waitFor(() => {});
    }
    
    const aiButton = screen.getByText('✨ Get AI Recommendations');
    await userEvent.click(aiButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/recommended-goals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  it('displays recommendations after fetching', async () => {
    const mockRecommendations = [
      {
        _id: 'test-1',
        title: 'Daily Walking',
        category: 'fitness',
        description: 'Start with daily walks',
        plan: 'Walk 30 minutes daily',
        reasoning: 'Good for beginners',
      },
    ];

    // Mock all API calls including partial onboarding calls
    (fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/onboarding/partial')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
      if (url.includes('/api/onboarding')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
      if (url.includes('/api/recommended-goals/generate')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ goals: mockRecommendations }),
        });
      }
      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });

    render(<OnboardingForm onComplete={mockOnComplete} />);
    
    // Navigate to final step
    for (let i = 0; i < 6; i++) {
      const nextButton = screen.getByText('Next');
      await userEvent.click(nextButton);
      await waitFor(() => {});
    }
    
    const aiButton = screen.getByText('✨ Get AI Recommendations');
    await userEvent.click(aiButton);
    
    await waitFor(() => {
      expect(screen.getByText('🎯 Your Personalized AI Recommendations')).toBeInTheDocument();
      expect(screen.getByText('Daily Walking')).toBeInTheDocument();
      expect(screen.getByText('Start with daily walks')).toBeInTheDocument();
      expect(screen.getByText('Walk 30 minutes daily')).toBeInTheDocument();
    });
  });

  it('can skip steps', async () => {
    render(<OnboardingForm onComplete={mockOnComplete} />);
    
    const skipButton = screen.getByText('Skip');
    await userEvent.click(skipButton);
    
    await waitFor(() => {
      expect(screen.getByText('Step 2 of 7')).toBeInTheDocument();
    });
  });

  it('can skip all remaining steps', async () => {
    render(<OnboardingForm onComplete={mockOnComplete} />);
    
    // Navigate to final step
    for (let i = 0; i < 6; i++) {
      const nextButton = screen.getByText('Next');
      await userEvent.click(nextButton);
      await waitFor(() => {});
    }
    
    const skipAllButton = screen.getByText('Skip All');
    await userEvent.click(skipAllButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String),
      });
    });
  });
});
