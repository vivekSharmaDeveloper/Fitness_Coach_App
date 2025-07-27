"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Goal } from "@/types/goal";
import { OnboardingData } from "@/components/onboarding/OnboardingForm";

interface Goal {
  title: string;
  category: string;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  status: string;
}

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
    // Simplified mock recommendations for now
    const mockRecommendations: Recommendation[] = [
      {
        title: "Daily Walking Goal",
        category: "fitness",
        targetValue: 30,
        unit: "minutes",
        description: "Walk for 30 minutes daily",
        confidence: 0.8,
        reasoning: "Walking is a great low-impact exercise for beginners"
      },
      {
        title: "Hydration Goal",
        category: "nutrition",
        targetValue: 8,
        unit: "glasses",
        description: "Drink 8 glasses of water daily",
        confidence: 0.9,
        reasoning: "Proper hydration is essential for health"
      }
    ];
    
    setRecommendations(mockRecommendations);
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