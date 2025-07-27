"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProgressTracker } from "@/components/goals/ProgressTracker";
import { CompletedTasks } from "@/components/goals/CompletedTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

interface Activity {
  name: string;
  description: string;
  targetValue: number;
  currentProgress: number;
  unit: string;
  isDailyTargetMet: boolean;
  lastUpdatedDate: Date;
}

interface DaySchedule {
  day: number;
  activities: Activity[];
}

interface Goal {
  _id: string;
  title: string;
  description: string;
  planDetails: {
    schedule: DaySchedule[];
  };
}

export default function GoalDetailPage() {
  const params = useParams();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        // First check if any progress needs to be reset
        const resetResponse = await fetch(`/api/goals/${params.goalId}/progress`);
        if (!resetResponse.ok) throw new Error("Failed to check progress reset");
        
        // Then fetch the goal data
        const response = await fetch(`/api/goals/${params.goalId}`);
        if (!response.ok) throw new Error("Failed to fetch goal");
        const data = await response.json();
        setGoal(data);
      } catch (error) {
        console.error("Error fetching goal:", error);
        toast({
          title: "Error",
          description: "Failed to load goal data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoal();
  }, [params.goalId]);

  const handleProgressUpdate = async (
    dayIndex: number,
    activityIndex: number,
    progress: number
  ) => {
    try {
      const response = await fetch(`/api/goals/${params.goalId}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dayIndex,
          activityIndex,
          progress,
        }),
      });

      if (!response.ok) throw new Error("Failed to update progress");
      const data = await response.json();

      // Update the goal state with the new progress
      setGoal((prevGoal) => {
        if (!prevGoal) return null;
        const newGoal = { ...prevGoal };
        newGoal.planDetails.schedule[dayIndex].activities[activityIndex] = {
          ...newGoal.planDetails.schedule[dayIndex].activities[activityIndex],
          ...data.activity,
        };
        return newGoal;
      });

      // Show success message
      toast({
        title: "Progress Updated",
        description: `Added ${progress} ${data.activity.unit}`,
      });
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
      throw error;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!goal) {
    return <div>Goal not found</div>;
  }

  return (
    <div className="container max-w-7xl py-8">
      <h1 className="text-3xl font-bold mb-8">{goal.title}</h1>
      <p className="text-gray-500 mb-8">{goal.description}</p>

      <Tabs defaultValue="day-1" className="space-y-6">
        <TabsList>
          {goal.planDetails.schedule.map((day, index) => (
            <TabsTrigger key={day.day} value={`day-${day.day}`}>
              Day {day.day}
            </TabsTrigger>
          ))}
        </TabsList>

        {goal.planDetails.schedule.map((day, dayIndex) => {
          // Separate active and completed activities
          const activeActivities = day.activities.filter(
            (activity) => !activity.isDailyTargetMet
          );
          const completedActivities = day.activities.filter(
            (activity) => activity.isDailyTargetMet
          );

          return (
            <TabsContent key={day.day} value={`day-${day.day}`} className="space-y-6">
              {/* Active Activities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Active Tasks</h3>
                {activeActivities.map((activity, activityIndex) => (
                  <div key={activity.name} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{activity.name}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-sm">
                      Progress: {activity.currentProgress || 0} / {activity.targetValue} {activity.unit}
                    </p>
                  </div>
                ))}
              </div>

              {/* Completed Activities */}
              {completedActivities.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Completed Tasks</h3>
                  {completedActivities.map((activity, index) => (
                    <div key={activity.name} className="p-4 border rounded-lg bg-green-50">
                      <h4 className="font-medium text-green-800">{activity.name}</h4>
                      <p className="text-sm text-green-600">{activity.description}</p>
                      <p className="text-sm text-green-600">
                        Completed: {activity.currentProgress} / {activity.targetValue} {activity.unit}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
} 