"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

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
}

interface CompletedTasksProps {
  goals: Goal[];
}

export function CompletedTasks({ goals }: CompletedTasksProps) {
  // Filter completed goals
  const completedGoals = goals.filter(goal => 
    goal.currentProgress && goal.currentProgress >= goal.targetValue
  );

  if (completedGoals.length === 0) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Completed Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {completedGoals.map((goal) => (
            <div
              key={goal._id}
              className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100"
            >
              <div className="space-y-1">
                <p className="font-medium text-green-800">{goal.title}</p>
                <p className="text-sm text-green-600">
                  {goal.currentProgress} / {goal.targetValue} {goal.unit}
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 