"use client";

import { useEffect, useState } from "react";
import GoalCard from "@/components/goals/GoalCard";
import { toast } from "@/components/ui/use-toast";

interface Goal {
  _id: string;
  title: string;
  category: string;
  targetValue: number;
  unit: string;
  currentProgress?: number;
  startDate: string;
  endDate: string;
  status: "not_started" | "in_progress" | "completed" | "abandoned";
  updatedAt?: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch("/api/goals", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch goals");
      const data = await response.json();
      setGoals(data.goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast({
        title: "Error",
        description: "Failed to load goals",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressUpdate = async (goalId: string, progress: number) => {
    console.log("Updating progress for goal:", goalId, "with progress:", progress);
    try {
      const response = await fetch(`/api/goals/${goalId}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ progress }),
      });

      console.log("API Response status:", response.status);
      const responseData = await response.json();
      console.log("API Response data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update progress");
      }

      // Update the goals state with the new progress
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal._id === goalId
            ? { ...goal, currentProgress: progress }
            : goal
        )
      );

      return responseData;
    } catch (error) {
      console.error("Error in handleProgressUpdate:", error);
      throw error; // Re-throw to let the GoalCard handle the error
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-7xl py-8">
      <h1 className="text-3xl font-bold mb-8">Your Goals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <GoalCard
            key={goal._id + (goal.updatedAt || "")}
            goal={goal}
            onProgressUpdate={handleProgressUpdate}
            refreshGoals={fetchGoals}
          />
        ))}
      </div>
    </div>
  );
} 