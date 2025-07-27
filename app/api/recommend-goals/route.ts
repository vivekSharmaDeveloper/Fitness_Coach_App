import { NextResponse } from "next/server";
import { OnboardingData } from "@/components/onboarding/OnboardingForm";

// Define recommendation template interface
interface RecommendationTemplate {
  id: string;
  name: string;
  goalType: string;
  description: string;
  planDetails: string;
  targetMetrics: string;
  duration: string;
  prerequisites: (onboarding: OnboardingData) => boolean;
  contraindications?: string[]; // Health conditions that make this recommendation unsafe
}

// Define simple recommendation templates
const RECOMMENDATION_TEMPLATES: RecommendationTemplate[] = [
  {
    id: "beginner-walking",
    name: "Daily Walking Goal",
    goalType: "fitness",
    description: "Start with a simple daily walking routine to improve cardiovascular health",
    planDetails: "Walk for 30 minutes daily, 5 days a week",
    targetMetrics: "150 minutes of walking per week",
    duration: "4 weeks",
    prerequisites: () => true
  },
  {
    id: "hydration-habit",
    name: "Hydration Goal", 
    goalType: "nutrition",
    description: "Maintain proper hydration throughout the day",
    planDetails: "Drink 8 glasses of water daily",
    targetMetrics: "8 glasses of water per day",
    duration: "4 weeks",
    prerequisites: () => true
  },
  {
    id: "sleep-schedule",
    name: "Sleep Schedule Goal",
    goalType: "sleep",
    description: "Establish a consistent sleep routine for better rest",
    planDetails: "Go to bed at the same time every night, aim for 7-8 hours",
    targetMetrics: "7-8 hours of sleep per night",
    duration: "4 weeks",
    prerequisites: () => true
  }
];

// Helper functions for recommendation logic
function getFitnessLevel(physicalActivity: string): number {
  const levels: { [key: string]: number } = {
    "Never": 1,
    "Rarely (1-2 times/month)": 2,
    "Sometimes (1-2 times/week)": 3,
    "Regularly (3-4 times/week)": 4,
    "Very active (5+ times/week)": 5
  };
  return levels[physicalActivity] || 3;
}

function hasContraindications(
  template: RecommendationTemplate,
  healthConditions: string[]
): boolean {
  if (!template.contraindications) return false;
  return template.contraindications.some(condition => 
    healthConditions.includes(condition)
  );
}

function calculateRecommendationScore(
  template: RecommendationTemplate,
  onboarding: OnboardingData
): number {
  // Just return a simple score based on template index for now
  return Math.random() * 10;
}

export async function POST(request: Request) {
  try {
    const onboardingData: OnboardingData = await request.json();

    // For now, assume no health conditions since they're not in the OnboardingData interface
    const healthConditions: string[] = [];

    // Filter and score recommendations
    const recommendations = RECOMMENDATION_TEMPLATES
      .filter(template => {
        // Check prerequisites
        if (!template.prerequisites(onboardingData)) return false;
        
        // Check contraindications
        if (hasContraindications(template, healthConditions)) return false;
        
        return true;
      })
      .map(template => ({
        ...template,
        score: calculateRecommendationScore(template, onboardingData)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Return top 3 recommendations

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error in recommend-goals:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
} 