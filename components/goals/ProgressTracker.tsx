"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
// import { Goal } from "@/types/goal";

interface Goal {
  _id: string;
  title: string;
  targetValue: number;
  currentProgress?: number;
  status: string;
}

interface ProgressTrackerProps {
  goals: Goal[];
}

export function ProgressTracker({ goals }: ProgressTrackerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate total progress and target
  const totalProgress = goals.reduce((sum, goal) => sum + (goal.currentProgress || 0), 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetValue, 0);
  
  // Calculate overall progress percentage
  const overallProgress = totalTarget > 0 ? (totalProgress / totalTarget) * 100 : 0;

  // Calculate completed goals
  const completedGoals = goals.filter(
    (goal) => goal.status === "completed"
  ).length;

  const getProgressColor = (percentage: number) => {
    if (percentage <= 33) {
      return "bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500";
    } else if (percentage <= 66) {
      return "bg-gradient-to-r from-amber-400 to-amber-500 dark:from-amber-300 dark:to-amber-400";
    } else {
      return "bg-gradient-to-r from-emerald-400 to-emerald-500 dark:from-emerald-300 dark:to-emerald-400";
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Goals Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {completedGoals} of {goals.length} goals completed
              </p>
              <p className="text-sm text-muted-foreground">
                {totalProgress.toFixed(1)} / {totalTarget.toFixed(1)} units
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{Math.round(overallProgress)}%</p>
            </div>
          </div>
          
          <Progress 
            value={overallProgress} 
            className={cn(
              "h-2.5 transition-all duration-700 ease-in-out shadow-sm",
              getProgressColor(overallProgress)
            )}
          />

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              {completedGoals === goals.length 
                ? "All goals completed! 🎉"
                : `${goals.length - completedGoals} goals remaining`
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 