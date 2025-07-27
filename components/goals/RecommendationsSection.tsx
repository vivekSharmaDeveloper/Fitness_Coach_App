"use client";

import { RecommendedGoalCard } from "@/components/goals/RecommendedGoalCard";
import { Sparkles } from "lucide-react";

interface RecommendationsSectionProps {
  recommendations?: any[];
}

export function RecommendationsSection({ recommendations = [] }: RecommendationsSectionProps) {
  console.log("RecommendationsSection received:", recommendations);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-semibold">AI-Powered Recommendations</h2>
      </div>
      
      {!recommendations || recommendations.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Complete your onboarding or create goals to get personalized AI recommendations
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((goal, index) => (
            <RecommendedGoalCard key={goal._id || index} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}
