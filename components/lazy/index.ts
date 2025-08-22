import { lazy } from 'react';

// Lazy load heavy dashboard components
export const LazyDashboard = lazy(() => 
  import('@/app/dashboard/dashboard-client').then(module => ({
    default: module.DashboardClient
  }))
);

export const LazyOnboardingForm = lazy(() => 
  import('@/components/onboarding/OnboardingForm').then(module => ({
    default: module.OnboardingForm
  }))
);

export const LazyGoalsPage = lazy(() => 
  import('@/app/goals/page').then(module => ({
    default: module.default
  }))
);

export const LazyStatsPage = lazy(() => 
  import('@/app/my-stats/page').then(module => ({
    default: module.default
  }))
);

// Lazy load chart libraries
export const LazyChart = lazy(() => 
  import('react-chartjs-2').then(module => ({
    default: module.Line
  }))
);

export const LazyRechartsChart = lazy(() => 
  import('recharts').then(module => ({
    default: module.LineChart
  }))
);

// Lazy load form components
export const LazyGoalDefinitionForm = lazy(() => 
  import('@/components/goals/GoalDefinitionForm').then(module => ({
    default: module.GoalDefinitionForm
  }))
);

// Lazy load AI components
export const LazyAIRecommendations = lazy(() => 
  import('@/components/recommendations/AIRecommendations').then(module => ({
    default: module.AIRecommendations
  }))
);

// Export for easier imports
export * from '@/components/ui/lazy-loader';
