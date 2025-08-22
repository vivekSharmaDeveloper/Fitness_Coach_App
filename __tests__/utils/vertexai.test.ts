import { generateFitnessRecommendations } from '../../lib/vertexai';
import { OnboardingData } from '../../components/onboarding/OnboardingForm';

// Mock the Vertex AI client
jest.mock('@google-cloud/aiplatform', () => ({
  PredictionServiceClient: jest.fn().mockImplementation(() => ({
    predict: jest.fn().mockResolvedValue([{
      predictions: [{
        structValue: {
          fields: {
            content: {
              stringValue: JSON.stringify({
                recommendations: [
                  {
                    title: 'Test Goal',
                    category: 'fitness',
                    description: 'Test description',
                    plan: 'Test plan',
                    reasoning: 'Test reasoning'
                  }
                ]
              })
            }
          }
        }
      }]
    }])
  }))
}));

describe('generateFitnessRecommendations', () => {
  const mockUserData: OnboardingData = {
    goals: ['lose weight', 'build muscle'],
    goalImportance: 4,
    successDefinition: 'Feel more confident',
    sleepHours: 7,
    sleepQuality: 'Good',
    consistentSleep: true,
    eatingHabits: 'Balanced',
    waterIntake: 8,
    physicalActivity: '2-3 times',
    stressLevel: 'Moderate',
    relaxationFrequency: 'Daily',
    mindfulnessPractice: false,
    screenTime: 4,
    mindlessScrolling: false,
    existingGoodHabits: ['regular exercise'],
    habitsToBreak: ['late night snacking'],
    obstacles: ['time constraints'],
    disciplineLevel: 3,
    peakProductivityTime: 'Morning',
    reminderPreference: 'Push notifications',
    habitApproach: 'Start small and build up gradually',
    dailyTimeCommitment: '30-60 mins',
    motivationFactors: ['health', 'appearance'],
    ageRange: '25-34',
    gender: 'male',
    occupation: 'Software Engineer'
  };

  beforeEach(() => {
    process.env.GOOGLE_CLOUD_PROJECT_ID = 'test-project';
    process.env.GOOGLE_CLOUD_LOCATION = 'us-central1';
  });

  it('should generate recommendations using Vertex AI', async () => {
    const recommendations = await generateFitnessRecommendations(mockUserData);
    
    expect(recommendations).toBeDefined();
    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0]).toHaveProperty('title');
    expect(recommendations[0]).toHaveProperty('category');
    expect(recommendations[0]).toHaveProperty('description');
    expect(recommendations[0]).toHaveProperty('plan');
  });

  it('should fallback to smart recommendations if Vertex AI fails', async () => {
    // Remove project ID to force fallback
    const originalProjectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    delete process.env.GOOGLE_CLOUD_PROJECT_ID;
    
    const recommendations = await generateFitnessRecommendations(mockUserData);
    
    expect(recommendations).toBeDefined();
    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations.length).toBe(3); // Smart recommendations always return 3
    
    // Restore the project ID
    if (originalProjectId) {
      process.env.GOOGLE_CLOUD_PROJECT_ID = originalProjectId;
    }
  });

  it('should generate fitness recommendations for inactive users', async () => {
    // Force fallback to smart recommendations by removing project ID
    const originalProjectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    delete process.env.GOOGLE_CLOUD_PROJECT_ID;
    
    const inactiveUserData = {
      ...mockUserData,
      physicalActivity: 'Never',
      sleepQuality: 'Poor',  // Trigger sleep recommendation
      stressLevel: 'High'    // Trigger mental health recommendation
    };
    
    const recommendations = await generateFitnessRecommendations(inactiveUserData);
    
    expect(recommendations).toBeDefined();
    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations.length).toBe(3);
    
    // Since it falls back to smart recommendations, check for specific fitness recommendation
    const fitnessRec = recommendations.find(r => r.category === 'fitness');
    expect(fitnessRec).toBeDefined();
    expect(fitnessRec?.title).toContain('Walking');
    
    // Restore the project ID
    if (originalProjectId) {
      process.env.GOOGLE_CLOUD_PROJECT_ID = originalProjectId;
    }
  });

  it('should generate sleep recommendations for poor sleep quality', async () => {
    // Force fallback to smart recommendations by removing project ID
    const originalProjectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    delete process.env.GOOGLE_CLOUD_PROJECT_ID;
    
    const poorSleepUserData = {
      ...mockUserData,
      sleepQuality: 'Poor',
      sleepHours: 5,
      consistentSleep: false,
      physicalActivity: 'Never',  // Trigger fitness recommendation  
      eatingHabits: 'Poor'        // Trigger nutrition recommendation
    };
    
    const recommendations = await generateFitnessRecommendations(poorSleepUserData);
    
    expect(recommendations.length).toBe(3);
    const sleepRec = recommendations.find(r => r.category === 'sleep');
    expect(sleepRec).toBeDefined();
    expect(sleepRec?.title).toContain('Sleep');
    
    // Restore the project ID
    if (originalProjectId) {
      process.env.GOOGLE_CLOUD_PROJECT_ID = originalProjectId;
    }
  });

  it('should generate nutrition recommendations for poor eating habits', async () => {
    // Force fallback to smart recommendations by removing project ID
    const originalProjectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    delete process.env.GOOGLE_CLOUD_PROJECT_ID;
    
    const poorNutritionUserData = {
      ...mockUserData,
      eatingHabits: 'Poor',
      waterIntake: 3,
      physicalActivity: 'Never',   // Trigger fitness recommendation
      stressLevel: 'High'          // Trigger mental health recommendation
    };
    
    const recommendations = await generateFitnessRecommendations(poorNutritionUserData);
    
    expect(recommendations.length).toBe(3);
    const nutritionRec = recommendations.find(r => r.category === 'nutrition');
    expect(nutritionRec).toBeDefined();
    expect(
      nutritionRec?.title.includes('Nutrition') || 
      nutritionRec?.title.includes('Hydration')
    ).toBe(true);
    
    // Restore the project ID
    if (originalProjectId) {
      process.env.GOOGLE_CLOUD_PROJECT_ID = originalProjectId;
    }
  });

  it('should generate mental health recommendations for high stress', async () => {
    // Force fallback to smart recommendations by removing project ID
    const originalProjectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    delete process.env.GOOGLE_CLOUD_PROJECT_ID;
    
    const highStressUserData = {
      ...mockUserData,
      stressLevel: 'Very High',
      physicalActivity: 'Never',  // Trigger fitness recommendation
      eatingHabits: 'Poor'        // Trigger nutrition recommendation
    };
    
    const recommendations = await generateFitnessRecommendations(highStressUserData);
    
    expect(recommendations.length).toBe(3);
    const mentalHealthRec = recommendations.find(r => r.category === 'mental_health');
    expect(mentalHealthRec).toBeDefined();
    expect(
      mentalHealthRec?.title.includes('Stress') || 
      mentalHealthRec?.title.includes('Mindfulness') || 
      mentalHealthRec?.title.includes('Management')
    ).toBe(true);
    
    // Restore the project ID
    if (originalProjectId) {
      process.env.GOOGLE_CLOUD_PROJECT_ID = originalProjectId;
    }
  });

  it('should generate productivity recommendations for high screen time', async () => {
    // Force fallback to smart recommendations by removing project ID
    const originalProjectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    delete process.env.GOOGLE_CLOUD_PROJECT_ID;
    
    const highScreenTimeUserData = {
      ...mockUserData,
      screenTime: 10,
      mindlessScrolling: true,
      physicalActivity: 'Never',  // Trigger fitness recommendation
      stressLevel: 'High'         // Trigger mental health recommendation
    };
    
    const recommendations = await generateFitnessRecommendations(highScreenTimeUserData);
    
    expect(recommendations.length).toBe(3);
    const productivityRec = recommendations.find(r => r.category === 'productivity');
    expect(productivityRec).toBeDefined();
    expect(
      productivityRec?.title.includes('Digital') || 
      productivityRec?.title.includes('Screen') || 
      productivityRec?.title.includes('Wellness')
    ).toBe(true);
    
    // Restore the project ID
    if (originalProjectId) {
      process.env.GOOGLE_CLOUD_PROJECT_ID = originalProjectId;
    }
  });
});
