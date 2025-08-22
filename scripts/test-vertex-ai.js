const { generateFitnessRecommendations } = require('../lib/vertexai.ts');

// Test data similar to what onboarding would generate
const testUserData = {
  goals: ['Improve physical health', 'Boost productivity', 'Improve relationships'],
  goalImportance: 4,
  successDefinition: 'Feel more energetic and focused',
  sleepHours: 7,
  sleepQuality: 'Fair',
  consistentSleep: false,
  eatingHabits: 'Balanced',
  waterIntake: 6,
  physicalActivity: '2-3 times',
  stressLevel: 'Moderate',
  relaxationFrequency: 'A few times a week',
  mindfulnessPractice: false,
  screenTime: 5,
  mindlessScrolling: true,
  existingGoodHabits: ['Regular exercise', 'Healthy eating'],
  habitsToBreak: ['Late night snacking', 'Excessive social media'],
  obstacles: ['Time constraints', 'Work stress'],
  disciplineLevel: 3,
  peakProductivityTime: 'Morning',
  reminderPreference: 'Push notifications',
  habitApproach: 'Start small and build up gradually',
  dailyTimeCommitment: '15-30 mins',
  motivationFactors: ['Health benefits', 'Better mood'],
  ageRange: '25-34',
  gender: 'Not specified',
  occupation: 'Software Developer'
};

async function testVertexAI() {
  console.log('🧪 Testing Vertex AI Recommendations...\n');
  
  try {
    const recommendations = await generateFitnessRecommendations(testUserData);
    
    console.log('✅ Success! Generated recommendations:');
    console.log('=====================================\n');
    
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.title}`);
      console.log(`   Category: ${rec.category}`);
      console.log(`   Description: ${rec.description}`);
      console.log(`   Plan: ${rec.plan}`);
      console.log(`   Reasoning: ${rec.reasoning}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 This is expected if you haven\'t set up Vertex AI yet.');
    console.log('📖 See VERTEX_AI_SETUP.md for instructions.');
  }
}

testVertexAI();
