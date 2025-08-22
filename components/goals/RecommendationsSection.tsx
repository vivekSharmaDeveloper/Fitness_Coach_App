"use client";

import { useState } from "react";
import { RecommendedGoalCard } from "@/components/goals/RecommendedGoalCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Sparkles, Loader2 } from "lucide-react";

interface RecommendationsSectionProps {
  recommendations?: any[];
}

export function RecommendationsSection({ recommendations = [] }: RecommendationsSectionProps) {
  const [aiRecommendations, setAiRecommendations] = useState(recommendations);
  const [isGenerating, setIsGenerating] = useState(false);
  
  console.log("RecommendationsSection received:", recommendations);

  const handleGenerateRecommendations = async () => {
    try {
      setIsGenerating(true);
      
      const response = await fetch('/api/recommended-goals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI recommendations');
      }

      const data = await response.json();
      setAiRecommendations(data.goals || []);
      
      toast({
        title: "AI Recommendations Generated!",
        description: `Generated ${data.goals?.length || 0} personalized goal recommendations.`,
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">AI-Powered Recommendations</h2>
        </div>
        <Button 
          onClick={handleGenerateRecommendations}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isGenerating ? "Generating..." : "Get AI Recommendations"}
        </Button>
      </div>
      
      {!aiRecommendations || aiRecommendations.length === 0 ? (
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
          {aiRecommendations.map((goal, index) => (
            <RecommendedGoalCard key={goal._id || index} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}
