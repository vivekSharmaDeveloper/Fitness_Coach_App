import { NextResponse } from "next/server";
import { getOpenAIRecommendations } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables." 
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { onboardingData, userId } = body;
    
    // If no onboarding data provided, return mock recommendations
    if (!onboardingData) {
      const mockRecommendations = [
        {
          title: "Daily Walking Goal",
          category: "fitness",
          description: "Start with a simple daily walking routine to improve cardiovascular health",
          plan: "Walk for 30 minutes daily, 5 days a week"
        },
        {
          title: "Hydration Habit",
          category: "nutrition", 
          description: "Maintain proper hydration throughout the day",
          plan: "Drink 8 glasses of water daily"
        },
        {
          title: "Sleep Schedule",
          category: "sleep",
          description: "Establish a consistent sleep routine for better rest",
          plan: "Go to bed at the same time every night, aim for 7-8 hours"
        }
      ];
      
      return NextResponse.json({ success: true, recommendations: mockRecommendations });
    }
    
    const recommendations = await getOpenAIRecommendations(onboardingData);
    return NextResponse.json({ success: true, recommendations });
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
