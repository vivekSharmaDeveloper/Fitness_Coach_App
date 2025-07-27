"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Goal } from "@/types/goal";
import { OnboardingData } from "@/types/onboarding";

interface AIRecommendationsProps {
  onboardingData: OnboardingData;
  existingGoals: Goal[];
  onAddGoal: (goal: Partial<Goal>) => Promise<void>;
}

interface Recommendation {
  title: string;
  category: string;
  targetValue: number;
  unit: string;
  description: string;
  confidence: number;
  reasoning: string;
}

export function AIRecommendations({ onboardingData, existingGoals, onAddGoal }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeUserData = () => {
    const recommendations: Recommendation[] = [];
    const { 
      goals, 
      successDefinition, 
      goalImportance,
      physicalActivity,
      sleepHours,
      sleepQuality,
      consistentSleep,
      eatingHabits,
      dietaryPreferences,
      stressLevel,
      relaxationFrequency,
      mindfulnessPractice,
      existingGoodHabits,
      habitsToBreak,
      obstacles,
      disciplineLevel,
      peakProductivityTime,
      dailyTimeCommitment,
      motivationFactors
    } = onboardingData;

    // Analyze primary goals and success definitions
    goals.forEach((goal, index) => {
      const successDef = successDefinition[index];
      const importance = goalImportance[index];

      // Physical Health Goals
      if (goal === "Improve physical health") {
        const fitnessLevel = getFitnessLevel(physicalActivity);
        const targetValue = calculateTargetValue(fitnessLevel, "physical");
        
        recommendations.push({
          title: "Weekly Exercise Goal",
          category: "physical_health",
          targetValue,
          unit: "minutes",
          description: `Complete ${targetValue} minutes of exercise per week`,
          confidence: calculateConfidence(importance, fitnessLevel),
          reasoning: `Based on your current activity level (${physicalActivity}) and success definition of "${successDef}"`
        });
      }

      // Mental Well-being Goals
      if (goal === "Enhance mental well-being") {
        const stressScore = calculateStressScore(stressLevel, relaxationFrequency, mindfulnessPractice);
        const targetValue = calculateTargetValue(stressScore, "mental");
        
        recommendations.push({
          title: "Daily Mindfulness Practice",
          category: "mental_wellbeing",
          targetValue,
          unit: "minutes",
          description: `Practice mindfulness for ${targetValue} minutes daily`,
          confidence: calculateConfidence(importance, stressScore),
          reasoning: `Based on your stress level (${stressLevel}) and relaxation frequency (${relaxationFrequency})`
        });
      }

      // Sleep Quality Goals
      if (sleepHours < 7 || sleepQuality < 4 || !consistentSleep) {
        recommendations.push({
          title: "Sleep Improvement",
          category: "sleep_quality",
          targetValue: 7,
          unit: "hours",
          description: "Achieve 7 hours of quality sleep consistently",
          confidence: 0.8,
          reasoning: `Based on your current sleep habits (${sleepHours} hours, quality: ${sleepQuality}/5)`
        });
      }

      // Nutrition Goals
      if (eatingHabits < 4) {
        recommendations.push({
          title: "Healthy Eating Habits",
          category: "nutrition",
          targetValue: 5,
          unit: "meals",
          description: "Prepare 5 healthy meals per week",
          confidence: 0.7,
          reasoning: `Based on your current eating habits (${eatingHabits}/5) and dietary preferences`
        });
      }
    });

    // Filter out recommendations that conflict with existing goals
    const filteredRecommendations = recommendations.filter(rec => 
      !existingGoals.some(goal => goal.category === rec.category)
    );

    // Sort by confidence and importance
    const sortedRecommendations = filteredRecommendations.sort((a, b) => b.confidence - a.confidence);

    setRecommendations(sortedRecommendations);
  };

  const getFitnessLevel = (activity: string): number => {
    const levels: { [key: string]: number } = {
      "Never": 1,
      "Rarely (1-2 times/month)": 2,
      "Sometimes (1-2 times/week)": 3,
      "Regularly (3-4 times/week)": 4,
      "Very active (5+ times/week)": 5
    };
    return levels[activity] || 3;
  };

  const calculateStressScore = (
    stressLevel: number,
    relaxationFrequency: string,
    mindfulnessPractice: boolean
  ): number => {
    const relaxationScore = {
      "Never": 1,
      "Rarely": 2,
      "Sometimes": 3,
      "Regularly": 4,
      "Daily": 5
    }[relaxationFrequency] || 3;

    return (stressLevel + relaxationScore + (mindfulnessPractice ? 2 : 0)) / 3;
  };

  const calculateTargetValue = (score: number, type: "physical" | "mental"): number => {
    if (type === "physical") {
      return Math.max(30, Math.min(300, score * 60));
    } else {
      return Math.max(5, Math.min(30, score * 10));
    }
  };

  const calculateConfidence = (importance: number, score: number): number => {
    return (importance + score) / 2;
  };

  const handleAddGoal = async (recommendation: Recommendation) => {
    setIsLoading(true);
    try {
      await onAddGoal({
        title: recommendation.title,
        category: recommendation.category,
        targetValue: recommendation.targetValue,
        unit: recommendation.unit,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        status: "not_started"
      });
      setRecommendations(prev => prev.filter(r => r !== recommendation));
    } catch (error) {
      console.error("Error adding goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    analyzeUserData();
  }, [onboardingData, existingGoals]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recommended Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{recommendation.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {recommendation.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {recommendation.reasoning}
                  </p>
                </div>
                <Button
                  onClick={() => handleAddGoal(recommendation)}
                  disabled={isLoading}
                >
                  Add Goal
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 