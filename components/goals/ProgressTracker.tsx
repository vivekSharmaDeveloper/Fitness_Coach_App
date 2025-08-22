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
  currentProgress: number;
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

  // Calculate completed goals
  const completedGoals = goals.filter(
    (goal) => goal.status === "completed"
  ).length;

  // Calculate overall progress based on individual goal progress
  const overallProgress = goals.length > 0 
    ? goals.reduce((acc, goal) => {
        const goalProgress = Math.min((goal.currentProgress / goal.targetValue) * 100, 100);
        return acc + goalProgress;
      }, 0) / goals.length
    : 0;

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
{goals.length === 0 ? "Start your goal journey!" :
                completedGoals === goals.length ? "All goals completed! 🎉" : `${goals.length - completedGoals} goals remaining`
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 