import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionProvider } from 'next-auth/react';
import { OnboardingForm } from '../../components/onboarding/OnboardingForm';

// Mock fetch for all API calls
global.fetch = jest.fn();

const mockSession = {
  user: {
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: '2024-01-01',
};

describe('Onboarding to Recommendations Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful responses for all API calls
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
          json: () => Promise.resolve({
            goals: [
              {
                _id: 'rec-1',
                title: 'Daily Walking Routine',
                category: 'fitness',
                description: 'Start with daily walks to build cardiovascular health',
                plan: 'Walk 30 minutes daily, gradually increasing pace',
                reasoning: 'Perfect for beginners looking to establish consistent exercise habits'
              },
              {
                _id: 'rec-2', 
                title: 'Sleep Quality Improvement',
                category: 'sleep',
                description: 'Establish consistent sleep schedule for better recovery',
                plan: 'Go to bed at 10 PM, wake up at 6 AM, create bedtime routine',
                reasoning: 'Better sleep will support your fitness goals and overall wellbeing'
              },
              {
                _id: 'rec-3',
                title: 'Mindful Eating Habits',
                category: 'nutrition',
                description: 'Develop awareness around eating patterns and choices',
                plan: 'Track meals for one week, eat without distractions, chew slowly',
                reasoning: 'Mindful eating will help with weight management and energy levels'
              }
            ]
          }),
        });
      }
      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });
  });

  const renderWithSession = (component: React.ReactElement) => {
    return render(
      <SessionProvider session={mockSession}>
        {component}
      </SessionProvider>
    );
  };

  it('completes full onboarding flow and displays AI recommendations', async () => {
    const mockOnComplete = jest.fn();
    
    renderWithSession(<OnboardingForm onComplete={mockOnComplete} />);

    // Navigate through all steps quickly
    for (let step = 1; step <= 6; step++) {
      expect(screen.getByText(`Step ${step} of 7`)).toBeInTheDocument();
      
      if (step < 7) {
        const nextButton = screen.getByText('Next');
        await userEvent.click(nextButton);
        await waitFor(() => {});
      }
    }

    // On final step, click AI recommendations button
    expect(screen.getByText('Step 7 of 7')).toBeInTheDocument();
    
    const aiButton = screen.getByText('✨ Get AI Recommendations');
    expect(aiButton).toBeInTheDocument();
    
    await userEvent.click(aiButton);

    // Wait for recommendations to load and display
    await waitFor(() => {
      expect(screen.getByText('🎯 Your Personalized AI Recommendations')).toBeInTheDocument();
    });

    // Verify all three recommendations are displayed
    expect(screen.getByText('Daily Walking Routine')).toBeInTheDocument();
    expect(screen.getByText('Sleep Quality Improvement')).toBeInTheDocument();
    expect(screen.getByText('Mindful Eating Habits')).toBeInTheDocument();

    // Verify recommendation details
    expect(screen.getByText('Start with daily walks to build cardiovascular health')).toBeInTheDocument();
    expect(screen.getByText('Walk 30 minutes daily, gradually increasing pace')).toBeInTheDocument();
    expect(screen.getByText('Perfect for beginners looking to establish consistent exercise habits')).toBeInTheDocument();

    // Verify category badges are displayed
    expect(screen.getByText('fitness')).toBeInTheDocument();
    expect(screen.getByText('sleep')).toBeInTheDocument();
    expect(screen.getByText('nutrition')).toBeInTheDocument();

    // Verify API calls were made correctly
    expect(fetch).toHaveBeenCalledWith('/api/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expect.any(String),
    });

    expect(fetch).toHaveBeenCalledWith('/api/recommended-goals/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API to return error for recommendations call
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
        return Promise.reject(new Error('API Error'));
      }
      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });

    const mockOnComplete = jest.fn();
    renderWithSession(<OnboardingForm onComplete={mockOnComplete} />);

    // Navigate to final step
    for (let step = 1; step <= 6; step++) {
      if (step < 7) {
        const nextButton = screen.getByText('Next');
        await userEvent.click(nextButton);
        await waitFor(() => {});
      }
    }

    // Try to get AI recommendations
    const aiButton = screen.getByText('✨ Get AI Recommendations');
    await userEvent.click(aiButton);

    // Should not crash, and button should be re-enabled after error
    await waitFor(() => {
      expect(aiButton).not.toBeDisabled();
    });

    // Recommendations section should not appear
    expect(screen.queryByText('🎯 Your Personalized AI Recommendations')).not.toBeInTheDocument();
  });

  it('displays loading state while fetching recommendations', async () => {
    // Mock API with delayed response for recommendations
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
        return new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ goals: [] }),
          }), 100)
        );
      }
      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });

    const mockOnComplete = jest.fn();
    renderWithSession(<OnboardingForm onComplete={mockOnComplete} />);

    // Navigate to final step
    for (let step = 1; step <= 6; step++) {
      if (step < 7) {
        const nextButton = screen.getByText('Next');
        await userEvent.click(nextButton);
        await waitFor(() => {});
      }
    }

    // Click AI recommendations button
    const aiButton = screen.getByText('✨ Get AI Recommendations');
    await userEvent.click(aiButton);

    // Verify loading state
    expect(screen.getByText('Getting Recommendations...')).toBeInTheDocument();
    expect(aiButton).toBeDisabled();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Getting Recommendations...')).not.toBeInTheDocument();
    });
  });

  it('allows user to submit after viewing recommendations', async () => {
    const mockOnComplete = jest.fn();
    renderWithSession(<OnboardingForm onComplete={mockOnComplete} />);

    // Navigate to final step and get recommendations
    for (let step = 1; step <= 6; step++) {
      if (step < 7) {
        const nextButton = screen.getByText('Next');
        await userEvent.click(nextButton);
        await waitFor(() => {});
      }
    }

    const aiButton = screen.getByText('✨ Get AI Recommendations');
    await userEvent.click(aiButton);

    await waitFor(() => {
      expect(screen.getByText('🎯 Your Personalized AI Recommendations')).toBeInTheDocument();
    });

    // Submit the form
    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });
});
