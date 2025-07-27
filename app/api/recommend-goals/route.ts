import { NextResponse } from "next/server";
import { OnboardingData } from "@/types/onboarding";

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

// Define recommendation templates
const RECOMMENDATION_TEMPLATES: RecommendationTemplate[] = [
  // Physical Health Templates
  {
    id: "beginner-walking",
    name: "Beginner Walking Program",
    goalType: "physical_health",
    description: "Start with a gentle walking program to build consistency and basic fitness.",
    planDetails: "Week 1-2: 15-min walks, 3x/week\nWeek 3-4: 20-min walks, 4x/week\nWeek 5-6: 25-min walks, 5x/week",
    targetMetrics: "Daily steps: 5,000 → 8,000",
    duration: "6 weeks",
    prerequisites: (onboarding) => 
      onboarding.physicalActivity === "Never" || 
      onboarding.physicalActivity === "Rarely (1-2 times/month)",
    contraindications: ["Severe joint pain", "Heart condition"]
  },
  {
    id: "intermediate-strength",
    name: "Intermediate Strength Training",
    goalType: "physical_health",
    description: "Build strength and muscle with a structured 4-day split program.",
    planDetails: "Upper/Lower split, 4 days/week\nFocus on compound movements\nProgressive overload",
    targetMetrics: "4 workouts/week, 8-12 reps per set",
    duration: "8 weeks",
    prerequisites: (onboarding) =>
      onboarding.physicalActivity === "Regularly (3-4 times/week)" &&
      onboarding.dailyTimeCommitment >= 45,
    contraindications: ["Recent surgery", "Severe back pain"]
  },
  {
    id: "advanced-hiit",
    name: "Advanced HIIT Program",
    goalType: "physical_health",
    description: "High-intensity interval training for maximum calorie burn and cardiovascular fitness.",
    planDetails: "3 HIIT sessions/week\n2 strength sessions/week\n1 active recovery day",
    targetMetrics: "5 workouts/week, 20-30 min HIIT sessions",
    duration: "8 weeks",
    prerequisites: (onboarding) =>
      onboarding.physicalActivity === "Very active (5+ times/week)" &&
      onboarding.dailyTimeCommitment >= 60,
    contraindications: ["Heart condition", "High blood pressure", "Recent injury"]
  },

  // Mental Well-being Templates
  {
    id: "beginner-mindfulness",
    name: "Beginner Mindfulness Practice",
    goalType: "mental_wellbeing",
    description: "Start your mindfulness journey with short, guided sessions.",
    planDetails: "Daily 5-min guided meditation\nWeekly journaling\nBreathing exercises",
    targetMetrics: "5 minutes daily meditation",
    duration: "4 weeks",
    prerequisites: (onboarding) =>
      onboarding.stressLevel >= 3 &&
      !onboarding.mindfulnessPractice
  },
  {
    id: "sleep-improvement",
    name: "Sleep Quality Enhancement",
    goalType: "mental_wellbeing",
    description: "Improve sleep quality through better habits and routines.",
    planDetails: "Consistent bedtime routine\nScreen time reduction\nSleep environment optimization",
    targetMetrics: "7-8 hours of quality sleep",
    duration: "4 weeks",
    prerequisites: (onboarding) =>
      onboarding.sleepHours < 7 ||
      onboarding.sleepQuality < 4 ||
      !onboarding.consistentSleep
  },

  // Nutrition Templates
  {
    id: "healthy-eating-basics",
    name: "Healthy Eating Basics",
    goalType: "nutrition",
    description: "Build a foundation of healthy eating habits.",
    planDetails: "Meal planning basics\nPortion control\nHealthy snack alternatives",
    targetMetrics: "5 balanced meals per week",
    duration: "4 weeks",
    prerequisites: (onboarding) =>
      onboarding.eatingHabits < 3
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
  let score = 0;

  // Primary goals match
  if (onboarding.goals.some(goal => 
    template.goalType.toLowerCase().includes(goal.toLowerCase())
  )) {
    score += 3;
  }

  // Fitness level appropriateness
  const fitnessLevel = getFitnessLevel(onboarding.physicalActivity);
  if (template.id.includes("beginner") && fitnessLevel <= 2) score += 2;
  if (template.id.includes("intermediate") && fitnessLevel === 3) score += 2;
  if (template.id.includes("advanced") && fitnessLevel >= 4) score += 2;

  // Time commitment match
  if (template.planDetails.includes("daily") && onboarding.dailyTimeCommitment >= 15) score += 1;
  if (template.planDetails.includes("weekly") && onboarding.dailyTimeCommitment >= 30) score += 1;

  // Obstacle consideration
  if (onboarding.obstacles.some(obstacle => 
    template.planDetails.toLowerCase().includes(obstacle.toLowerCase())
  )) {
    score += 1;
  }

  return score;
}

export async function POST(request: Request) {
  try {
    const onboardingData: OnboardingData = await request.json();

    // Get all health conditions
    const healthConditions = [
      ...(onboardingData.commonHealthConditions || []),
      ...(onboardingData.medicalConditions || [])
    ];

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