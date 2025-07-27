"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import GoalCard from "@/components/goals/GoalCard";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecommendationsSection } from "@/components/goals/RecommendationsSection";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";

interface DashboardData {
  dailyProgress: {
    steps: number;
    calories: number;
    water: number;
    sleep: number;
  };
  weeklyStats: {
    workouts: number;
    totalMinutes: number;
    caloriesBurned: number;
  };
  goals: {
    completed: number;
    inProgress: number;
    total: number;
  };
}

interface DashboardClientProps {
  activeGoals: any[];
  nonActiveGoals: any[];
  recommendedGoals: any[];
}

export function DashboardClient({ activeGoals, nonActiveGoals, recommendedGoals }: DashboardClientProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error instanceof Error ? error.message : "Failed to load dashboard data");
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressUpdate = async (goalId: string, progress: number) => {
    try {
      const response = await fetch(`/api/goals/${goalId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      // Refresh dashboard data after successful update
      await fetchDashboardData();
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-7xl py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={fetchDashboardData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Track your progress and discover new goals
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/goals/define-smart">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Goal
            </Button>
          </Link>
        </div>
      </div>

      {data && (
        <>
          {/* Daily Progress Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{data.dailyProgress.steps} / 10,000</span>
                  </div>
                  <Progress value={(data.dailyProgress.steps / 10000) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{data.dailyProgress.calories} / 2,000</span>
                  </div>
                  <Progress value={(data.dailyProgress.calories / 2000) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Water</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{data.dailyProgress.water} / 8 glasses</span>
                  </div>
                  <Progress value={(data.dailyProgress.water / 8) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sleep</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{data.dailyProgress.sleep} / 8 hours</span>
                  </div>
                  <Progress value={(data.dailyProgress.sleep / 8) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.weeklyStats.workouts}</p>
                <p className="text-sm text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Minutes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.weeklyStats.totalMinutes}</p>
                <p className="text-sm text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calories Burned</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.weeklyStats.caloriesBurned}</p>
                <p className="text-sm text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Goals Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Completed Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{data.goals.completed}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{data.goals.inProgress}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <XCircle className="h-8 w-8 text-gray-500" />
                  <div>
                    <p className="text-2xl font-bold">{data.goals.total}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Goals</TabsTrigger>
          <TabsTrigger value="non-active">Non-Active Goals</TabsTrigger>
          <TabsTrigger value="recommended">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {activeGoals.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No active goals</h2>
              <p className="text-gray-500 mb-4">
                Start your journey by creating your first SMART goal
              </p>
              <Link href="/goals/define-smart">
                <Button>Create Your First Goal</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeGoals.map((goal: any) => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  onProgressUpdate={handleProgressUpdate}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="non-active" className="space-y-6">
          {nonActiveGoals.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No non-active goals</h2>
              <p className="text-gray-500">
                Goals that are completed or abandoned will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nonActiveGoals.map((goal: any) => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  onProgressUpdate={handleProgressUpdate}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommended">
          <RecommendationsSection recommendations={recommendedGoals} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 