import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '../../components/theme-provider';

// Mock session for tests
export const mockSession = {
  user: {
    email: 'test@example.com',
    name: 'Test User',
    id: 'test-user-id',
  },
  expires: '2024-12-31T23:59:59.999Z',
};

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider session={mockSession}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Helper functions for common test scenarios
export const mockFetch = (response: any, ok = true, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(response),
  });
};

export const mockFetchError = (error: string) => {
  global.fetch = jest.fn().mockRejectedValue(new Error(error));
};

// Mock user data for testing
export const mockOnboardingData = {
  goals: ['lose weight', 'build muscle'],
  goalImportance: 4,
  successDefinition: 'Feel more confident and healthy',
  sleepHours: 7,
  sleepQuality: 'Good',
  consistentSleep: true,
  eatingHabits: 'Balanced',
  waterIntake: 8,
  physicalActivity: '2-3 times',
  stressLevel: 'Moderate',
  relaxationFrequency: 'A few times a week',
  mindfulnessPractice: false,
  screenTime: 4,
  mindlessScrolling: false,
  existingGoodHabits: ['regular exercise'],
  habitsToBreak: ['late night snacking'],
  obstacles: ['time constraints', 'motivation'],
  disciplineLevel: 3,
  peakProductivityTime: 'Morning',
  reminderPreference: 'Push notifications',
  habitApproach: 'Start small and build up gradually',
  dailyTimeCommitment: '30-60 mins',
  motivationFactors: ['health', 'appearance'],
  ageRange: '25-34',
  gender: 'male',
  occupation: 'Software Engineer',
};

export const mockRecommendations = [
  {
    _id: 'rec-1',
    title: 'Daily Walking Routine',
    category: 'fitness' as const,
    description: 'Build cardiovascular health with daily walks',
    plan: 'Walk 30 minutes daily, gradually increasing pace',
    reasoning: 'Perfect starting point for consistent exercise habits',
  },
  {
    _id: 'rec-2',
    title: 'Sleep Optimization',
    category: 'sleep' as const,
    description: 'Improve sleep quality and consistency',
    plan: 'Establish 10 PM bedtime, create relaxing routine',
    reasoning: 'Better sleep supports all fitness goals',
  },
  {
    _id: 'rec-3',
    title: 'Mindful Nutrition',
    category: 'nutrition' as const,
    description: 'Develop healthier eating patterns',
    plan: 'Track meals, eat without distractions, increase vegetables',
    reasoning: 'Mindful eating supports weight management goals',
  },
];

// Helper to wait for async operations
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0));

// Mock environment variables for tests
export const mockEnvironmentVariables = {
  GOOGLE_CLOUD_PROJECT_ID: 'test-project',
  GOOGLE_CLOUD_LOCATION: 'us-central1',
  MONGODB_URI: 'mongodb://localhost:27017/fitness_coach_test',
  NEXTAUTH_SECRET: 'test-secret',
  NEXTAUTH_URL: 'http://localhost:3000',
};

// Set up environment variables for tests
export const setupTestEnvironment = () => {
  Object.entries(mockEnvironmentVariables).forEach(([key, value]) => {
    process.env[key] = value;
  });
};

// Clean up environment variables after tests
export const cleanupTestEnvironment = () => {
  Object.keys(mockEnvironmentVariables).forEach(key => {
    delete process.env[key];
  });
};

// Simple test to ensure utilities are working
describe('Test Utilities', () => {
  it('should provide mock session data', () => {
    expect(mockSession).toBeDefined();
    expect(mockSession.user.email).toBe('test@example.com');
  });

  it('should provide mock onboarding data', () => {
    expect(mockOnboardingData).toBeDefined();
    expect(mockOnboardingData.goals).toEqual(['lose weight', 'build muscle']);
  });

  it('should provide mock recommendations', () => {
    expect(mockRecommendations).toBeDefined();
    expect(mockRecommendations.length).toBe(3);
    expect(mockRecommendations[0].category).toBe('fitness');
  });
});
