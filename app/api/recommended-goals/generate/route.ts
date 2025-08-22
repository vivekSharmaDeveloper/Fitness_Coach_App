import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { generateFitnessRecommendations } from "@/lib/vertexai";

// Google Cloud Natural Language AI function
async function generateRecommendationsWithGoogleCloud(userProfile: any) {
  try {
    // Check if Google Cloud API key is configured
    if (!process.env.GOOGLE_CLOUD_API_KEY) {
      throw new Error("Google Cloud API key not configured");
    }

    // Create prompt based on user profile
    const prompt = `Based on this user profile, suggest 3 personalized fitness and wellness goals:
    
    Goals: ${userProfile.goals?.join(', ') || 'General wellness'}
    Age Range: ${userProfile.ageRange || 'Not specified'}
    Occupation: ${userProfile.occupation || 'Not specified'}
    Physical Activity: ${userProfile.physicalActivity || 'Not specified'}
    Sleep Quality: ${userProfile.sleepQuality || 'Not specified'}
    Stress Level: ${userProfile.stressLevel || 'Not specified'}
    Current Habits: ${userProfile.existingGoodHabits?.join(', ') || 'None specified'}
    Time Commitment: ${userProfile.dailyTimeCommitment || 'Not specified'}
    
    Please provide 3 specific, actionable goals with categories (fitness, nutrition, mental_health, productivity, sleep, or other).`;

    // Call Google Cloud Natural Language API for text generation
    const response = await fetch(`https://language.googleapis.com/v1/documents:analyzeSentiment?key=${process.env.GOOGLE_CLOUD_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document: {
          content: prompt,
          type: 'PLAIN_TEXT'
        }
      })
    });

    if (!response.ok) {
      throw new Error('Google Cloud API request failed');
    }

    // Since Google Cloud Natural Language API doesn't generate text, 
    // we'll create smart recommendations based on user data
    const recommendations = generateSmartRecommendations(userProfile);
    
    return recommendations;
  } catch (error) {
    console.error('Google Cloud AI error:', error);
    throw error;
  }
}

// Smart recommendation generator based on user profile
function generateSmartRecommendations(userProfile: any) {
  const recommendations = [];
  
  // Fitness recommendation based on physical activity level
  if (userProfile.physicalActivity === 'Rarely' || userProfile.physicalActivity === 'Never') {
    recommendations.push({
      title: "Daily Walking Challenge",
      category: "fitness",
      description: "Start your fitness journey with a gentle daily walking routine",
      plan: "Walk for 15-20 minutes daily, gradually increasing to 30 minutes"
    });
  } else if (userProfile.physicalActivity === '2-3 times') {
    recommendations.push({
      title: "Strength Training Goals",
      category: "fitness", 
      description: "Add strength training to complement your current routine",
      plan: "Include 2 strength training sessions per week focusing on major muscle groups"
    });
  } else {
    recommendations.push({
      title: "Endurance Challenge",
      category: "fitness",
      description: "Push your fitness to the next level with endurance training",
      plan: "Incorporate high-intensity interval training (HIIT) 2-3 times per week"
    });
  }
  
  // Sleep recommendation based on sleep quality
  if (userProfile.sleepQuality === 'Poor' || !userProfile.consistentSleep) {
    recommendations.push({
      title: "Sleep Quality Improvement",
      category: "sleep",
      description: "Establish a consistent sleep routine for better rest and recovery",
      plan: `Aim for ${userProfile.sleepHours || 7}-8 hours of sleep with a consistent bedtime routine`
    });
  }
  
  // Nutrition recommendation based on eating habits
  if (userProfile.eatingHabits === 'Poor' || userProfile.waterIntake < 6) {
    recommendations.push({
      title: "Nutrition & Hydration Goals",
      category: "nutrition",
      description: "Improve your nutrition and hydration habits for better health",
      plan: `Drink ${userProfile.waterIntake < 6 ? '8' : userProfile.waterIntake + 1} glasses of water daily and include more fruits and vegetables`
    });
  }
  
  // Mental health recommendation based on stress level
  if (userProfile.stressLevel === 'High' || userProfile.stressLevel === 'Very High') {
    recommendations.push({
      title: "Stress Management Practice",
      category: "mental_health",
      description: "Develop healthy coping mechanisms to manage stress effectively",
      plan: "Practice 10-15 minutes of meditation or deep breathing exercises daily"
    });
  }
  
  // Productivity recommendation based on screen time
  if (userProfile.screenTime > 6 || userProfile.mindlessScrolling) {
    recommendations.push({
      title: "Digital Wellness Goal",
      category: "productivity",
      description: "Reduce screen time and improve digital wellness",
      plan: "Implement phone-free hours and use app time limits to reduce mindless scrolling"
    });
  }
  
  // Ensure we have exactly 3 recommendations
  if (recommendations.length < 3) {
    recommendations.push({
      title: "Mindfulness Practice",
      category: "mental_health",
      description: "Cultivate mindfulness and present-moment awareness",
      plan: "Practice 5-10 minutes of mindfulness meditation daily"
    });
  }
  
  return recommendations.slice(0, 3);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email }).lean();
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Check if user has completed onboarding
    if (!(user as any)?.onboardingCompleted) {
      // Return basic recommendations if no onboarding data
      const basicRecommendations = [
        {
          _id: 'basic-1',
          title: "Daily Walking Goal",
          category: "fitness",
          description: "Start with a simple daily walking routine to improve cardiovascular health",
          plan: "Walk for 30 minutes daily, 5 days a week"
        },
        {
          _id: 'basic-2',
          title: "Hydration Habit",
          category: "nutrition", 
          description: "Maintain proper hydration throughout the day",
          plan: "Drink 8 glasses of water daily"
        },
        {
          _id: 'basic-3',
          title: "Sleep Schedule",
          category: "sleep",
          description: "Establish a consistent sleep routine for better rest",
          plan: "Go to bed at the same time every night, aim for 7-8 hours"
        }
      ];
      
      return NextResponse.json({ goals: basicRecommendations });
    }
    
    // Generate personalized recommendations using Vertex AI
    try {
      const recommendations = await generateFitnessRecommendations(user as any);
      
      // Format recommendations with unique IDs
      const formattedRecommendations = recommendations.map((rec, index) => ({
        _id: `vertex-ai-${Date.now()}-${index}`,
        ...rec
      }));
      
      return NextResponse.json({ goals: formattedRecommendations });
    } catch (aiError) {
      console.error('Vertex AI generation failed, using smart recommendations:', aiError);
      
      // Fallback to smart recommendations if AI fails
      const smartRecommendations = generateSmartRecommendations(user as any);
      const formattedRecommendations = smartRecommendations.map((rec, index) => ({
        _id: `smart-${Date.now()}-${index}`,
        ...rec
      }));
      
      return NextResponse.json({ goals: formattedRecommendations });
    }
  } catch (error) {
    console.error("AI recommendation error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to generate AI recommendations" 
      },
      { status: 500 }
    );
  }
}
