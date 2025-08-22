import { PredictionServiceClient } from '@google-cloud/aiplatform';
import { OnboardingData } from '@/components/onboarding/OnboardingForm';

// Initialize Vertex AI client - using default credentials
const getVertexAIClient = () => {
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  return new PredictionServiceClient({
    apiEndpoint: `${location}-aiplatform.googleapis.com`,
  });
};

interface RecommendationGoal {
  title: string;
  category: 'fitness' | 'nutrition' | 'mental_health' | 'productivity' | 'sleep' | 'other';
  description: string;
  plan: string;
  reasoning: string;
}

export async function generateFitnessRecommendations(
  userData: OnboardingData
): Promise<RecommendationGoal[]> {
  try {
    // Check if Vertex AI is configured
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION;
    
    // Try Vertex AI if configured
    if (projectId && location) {
      try {
        console.log('🚀 Attempting Vertex AI recommendations for user:', userData.goals?.join(', '));
        const vertexRecommendations = await generateVertexAIRecommendations(userData);
        console.log('✅ Vertex AI recommendations generated successfully');
        return vertexRecommendations;
      } catch (vertexError) {
        console.error('❌ Vertex AI failed, using smart fallback:', vertexError);
      }
    } else {
      console.log('⚠️ Vertex AI not configured (missing GOOGLE_CLOUD_PROJECT_ID or GOOGLE_CLOUD_LOCATION)');
    }
    
    // Fallback to smart recommendations
    console.log('📋 Using smart recommendations fallback for user:', userData.goals?.join(', '));
    return generateSmartRecommendations(userData);
    
  } catch (error) {
    console.error('Recommendation generation error:', error);
    
    // Always fallback to smart recommendations
    return generateSmartRecommendations(userData);
  }
}

function createRecommendationPrompt(userData: OnboardingData): string {
  return `As a fitness and wellness expert, analyze this user profile and generate exactly 3 personalized, actionable fitness/wellness goals. Format the response as JSON with the following structure for each goal:

{
  "recommendations": [
    {
      "title": "Goal Title",
      "category": "fitness|nutrition|mental_health|productivity|sleep|other",
      "description": "Brief description of the goal",
      "plan": "Specific actionable plan",
      "reasoning": "Why this goal fits the user's profile"
    }
  ]
}

User Profile:
- Primary Goals: ${userData.goals?.join(', ') || 'General wellness'}
- Goal Importance (1-5): ${userData.goalImportance}
- Success Definition: ${userData.successDefinition || 'Not specified'}
- Sleep: ${userData.sleepHours} hours, Quality: ${userData.sleepQuality}, Consistent: ${userData.consistentSleep}
- Eating Habits: ${userData.eatingHabits}
- Water Intake: ${userData.waterIntake} glasses/day
- Physical Activity: ${userData.physicalActivity}
- Stress Level: ${userData.stressLevel}
- Relaxation Frequency: ${userData.relaxationFrequency}
- Mindfulness Practice: ${userData.mindfulnessPractice ? 'Yes' : 'No'}
- Screen Time: ${userData.screenTime} hours/day
- Mindless Scrolling: ${userData.mindlessScrolling ? 'Yes' : 'No'}
- Existing Good Habits: ${userData.existingGoodHabits?.join(', ') || 'None specified'}
- Habits to Break: ${userData.habitsToBreak?.join(', ') || 'None specified'}
- Main Obstacles: ${userData.obstacles?.join(', ') || 'None specified'}
- Discipline Level (1-5): ${userData.disciplineLevel}
- Peak Productivity: ${userData.peakProductivityTime}
- Reminder Preference: ${userData.reminderPreference}
- Habit Approach: ${userData.habitApproach}
- Daily Time Commitment: ${userData.dailyTimeCommitment}
- Motivation Factors: ${userData.motivationFactors?.join(', ') || 'None specified'}
- Age Range: ${userData.ageRange || 'Not specified'}
- Gender: ${userData.gender || 'Not specified'}
- Occupation: ${userData.occupation || 'Not specified'}

Please provide 3 specific, personalized recommendations that:
1. Address the user's stated goals and challenges
2. Are realistic given their time commitment and discipline level
3. Build on their existing good habits
4. Help overcome their stated obstacles
5. Match their preferred approach and productivity time

Focus on creating SMART goals that are specific, measurable, achievable, relevant, and time-bound.`;
}

function parseAIRecommendations(aiResponse: string, userData: OnboardingData): RecommendationGoal[] {
  try {
    // Try to parse JSON response first
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        return parsed.recommendations.slice(0, 3);
      }
    }

    // If JSON parsing fails, try to extract recommendations from text
    const recommendations: RecommendationGoal[] = [];
    const lines = aiResponse.split('\n');
    
    let currentRec: Partial<RecommendationGoal> = {};
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('Title:') || trimmed.includes('title:')) {
        if (currentRec.title) {
          recommendations.push(currentRec as RecommendationGoal);
          currentRec = {};
        }
        currentRec.title = trimmed.split(':')[1]?.trim() || '';
      } else if (trimmed.includes('Category:') || trimmed.includes('category:')) {
        currentRec.category = (trimmed.split(':')[1]?.trim().toLowerCase() || 'other') as any;
      } else if (trimmed.includes('Description:') || trimmed.includes('description:')) {
        currentRec.description = trimmed.split(':')[1]?.trim() || '';
      } else if (trimmed.includes('Plan:') || trimmed.includes('plan:')) {
        currentRec.plan = trimmed.split(':')[1]?.trim() || '';
      } else if (trimmed.includes('Reasoning:') || trimmed.includes('reasoning:')) {
        currentRec.reasoning = trimmed.split(':')[1]?.trim() || '';
      }
    }
    
    if (currentRec.title) {
      recommendations.push(currentRec as RecommendationGoal);
    }

    if (recommendations.length === 0) {
      throw new Error('Could not parse AI recommendations');
    }

    return recommendations.slice(0, 3);
  } catch (error) {
    console.error('Error parsing AI recommendations:', error);
    return generateSmartRecommendations(userData);
  }
}

function generateSmartRecommendations(userData: OnboardingData): RecommendationGoal[] {
  const recommendations: RecommendationGoal[] = [];
  
  // Fitness recommendation based on physical activity level
  if (userData.physicalActivity === 'Rarely' || userData.physicalActivity === 'Never') {
    recommendations.push({
      title: "Start Daily Walking Routine",
      category: "fitness",
      description: "Build a foundation of daily movement with a gentle walking routine",
      plan: `Start with 15-minute walks during your ${userData.peakProductivityTime.toLowerCase()} hours, gradually increasing to 30 minutes over 4 weeks`,
      reasoning: `Given your current low activity level and ${userData.dailyTimeCommitment} time commitment, walking is an achievable starting point that fits your schedule.`
    });
  } else if (userData.physicalActivity === '2-3 times') {
    recommendations.push({
      title: "Add Strength Training Sessions",
      category: "fitness", 
      description: "Complement your current routine with strength training for balanced fitness",
      plan: "Add 2 strength training sessions per week, focusing on major muscle groups with bodyweight or basic equipment",
      reasoning: `Your current activity level shows commitment, and adding strength training will enhance your overall fitness goals: ${userData.goals?.join(', ')}.`
    });
  } else {
    recommendations.push({
      title: "High-Intensity Interval Training",
      category: "fitness",
      description: "Maximize your fitness gains with efficient HIIT workouts",
      plan: "Incorporate 20-minute HIIT sessions 3 times per week, alternating with your current routine",
      reasoning: `With your active lifestyle, HIIT will help you achieve your goals of ${userData.goals?.join(', ')} more efficiently within your ${userData.dailyTimeCommitment} commitment.`
    });
  }
  
  // Sleep recommendation based on sleep quality and hours
  if (userData.sleepQuality === 'Poor' || userData.sleepHours < 7 || !userData.consistentSleep) {
    recommendations.push({
      title: "Optimize Sleep Quality & Schedule",
      category: "sleep",
      description: "Establish a consistent sleep routine for better recovery and energy",
      plan: `Create a bedtime routine 1 hour before your target sleep time, aiming for ${Math.max(7, userData.sleepHours)} hours of sleep consistently`,
      reasoning: `Your current sleep pattern (${userData.sleepHours} hours, ${userData.sleepQuality} quality) may be limiting your progress. Better sleep will support your ${userData.goals?.join(', ')} goals.`
    });
  }
  
  // Nutrition/hydration recommendation
  if (userData.eatingHabits === 'Poor' || userData.waterIntake < 8) {
    recommendations.push({
      title: "Improve Hydration & Nutrition",
      category: "nutrition",
      description: "Build healthy eating and hydration habits for sustained energy",
      plan: `Increase water intake to 8-10 glasses daily and add one extra serving of vegetables to each meal`,
      reasoning: `Your current hydration (${userData.waterIntake} glasses) and eating habits can be improved to better support your wellness goals and energy levels.`
    });
  }
  
  // Mental health recommendation based on stress level
  if (userData.stressLevel === 'High' || userData.stressLevel === 'Very High') {
    recommendations.push({
      title: "Daily Stress Management Practice",
      category: "mental_health",
      description: "Develop effective stress management techniques for better well-being",
      plan: `Practice 10-15 minutes of deep breathing or meditation daily, preferably during your ${userData.peakProductivityTime.toLowerCase()} hours`,
      reasoning: `Your high stress level needs attention to support your overall wellness goals and prevent burnout from your lifestyle changes.`
    });
  }
  
  // Digital wellness recommendation
  if (userData.screenTime > 6 || userData.mindlessScrolling) {
    recommendations.push({
      title: "Digital Wellness Boundaries",
      category: "productivity",
      description: "Create healthy boundaries with technology for better focus and sleep",
      plan: "Implement phone-free hours 2 hours before bedtime and use app timers to limit social media to 30 minutes daily",
      reasoning: `Your current screen time (${userData.screenTime} hours) and scrolling habits may interfere with sleep quality and goal achievement.`
    });
  }
  
  // Ensure we have exactly 3 recommendations
  while (recommendations.length < 3) {
    if (!recommendations.find(r => r.category === 'mental_health')) {
      recommendations.push({
        title: "Mindfulness Practice",
        category: "mental_health",
        description: "Cultivate present-moment awareness and emotional balance",
        plan: "Practice 5-10 minutes of mindfulness meditation daily, starting with guided apps",
        reasoning: "Mindfulness will support all your other goals by improving focus, reducing reactivity, and enhancing overall well-being."
      });
    } else {
      recommendations.push({
        title: "Progressive Goal Achievement",
        category: "productivity",
        description: "Build momentum with small, consistent daily actions",
        plan: "Choose one small action from each goal area and do it daily for 21 days to build the habit",
        reasoning: `Given your preference for '${userData.habitApproach}', starting small will help you build sustainable momentum toward your goals.`
      });
    }
  }
  
  return recommendations.slice(0, 3);
}

// Vertex AI Implementation using Gemini Pro
async function generateVertexAIRecommendations(userData: OnboardingData): Promise<RecommendationGoal[]> {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  
  if (!projectId) {
    throw new Error('GOOGLE_CLOUD_PROJECT_ID environment variable is required for Vertex AI');
  }

  const prompt = createRecommendationPrompt(userData);
  const client = getVertexAIClient();
  
  try {
    // Using Gemini Pro model through Vertex AI
    const endpoint = `projects/${projectId}/locations/${location}/publishers/google/models/gemini-1.5-pro`;
    
    const instanceValue = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generation_config: {
        temperature: 0.7,
        top_p: 0.8,
        top_k: 40,
        max_output_tokens: 2048,
        response_mime_type: "application/json"
      },
      safety_settings: [
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const request = {
      endpoint,
      instances: [instanceValue]
    };

    console.log('🤖 Calling Vertex AI Gemini with:', { projectId, location, endpoint });
    
    const [response] = await client.predict(request);
    
    if (!response.predictions || response.predictions.length === 0) {
      throw new Error('No predictions returned from Vertex AI');
    }

    const prediction = response.predictions[0];
    const aiResponse = prediction.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      console.error('Vertex AI Response Structure:', JSON.stringify(prediction, null, 2));
      throw new Error('Invalid response format from Vertex AI');
    }

    console.log('🤖 Vertex AI Raw Response:', aiResponse);

    // Parse the AI response
    try {
      const parsed = JSON.parse(aiResponse);
      const recommendations = parsed.recommendations || [];
      
      if (!Array.isArray(recommendations) || recommendations.length === 0) {
        throw new Error('No recommendations found in AI response');
      }

      // Format recommendations to match our interface
      const formattedRecommendations: RecommendationGoal[] = recommendations.slice(0, 3).map(rec => ({
        title: rec.title || 'Unnamed Goal',
        category: (rec.category || 'other').toLowerCase(),
        description: rec.description || '',
        plan: rec.plan || rec.actionPlan || rec.weeklyPlan || '',
        reasoning: rec.reasoning || rec.why || ''
      }));

      return formattedRecommendations;

    } catch (parseError) {
      console.error('Failed to parse JSON, trying text parsing:', parseError);
      // Fallback to text parsing
      const recommendations = parseAIRecommendations(aiResponse, userData);
      
      if (recommendations.length === 0) {
        throw new Error('Failed to parse Vertex AI recommendations');
      }

      return recommendations;
    }

  } catch (error) {
    console.error('Vertex AI generation error:', error);
    throw error;
  }
}
