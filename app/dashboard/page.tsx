"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryTabs } from "@/components/goals/CategoryTabs";
import GoalCard from "@/components/goals/GoalCard";
import { ProgressTracker } from "@/components/goals/ProgressTracker";
import { CompletedTasks } from "@/components/goals/CompletedTasks";
import { RecommendationsSection } from "@/components/goals/RecommendationsSection";
import { Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "fitness", label: "Fitness" },
  { value: "nutrition", label: "Nutrition" },
  { value: "mental_health", label: "Mental Health" },
  { value: "productivity", label: "Productivity" },
  { value: "sleep", label: "Sleep" },
  { value: "other", label: "Other" },
] as const;

function DashboardContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  const [goals, setGoals] = useState<any[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      if (category && category !== 'all') {
        queryParams.set('category', category);
      }
      
      const response = await fetch(`/api/goals?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      
      const data = await response.json();
      setGoals(data.goals || []);
      setCategoryCounts(data.categoryCounts || {});
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError('Failed to load goals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [category]);

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
      
      // Update the local state
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal._id === goalId 
            ? { ...goal, currentProgress: progress }
            : goal
        )
      );
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error; // Re-throw to let GoalCard handle the error
    }
  };

  const refreshGoals = () => {
    fetchGoals();
  };

  // Only show category badges in the "All" tab
  const showCategory = !category || category === "all";

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-red-600 dark:text-red-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Unable to Load Goals
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {error}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={fetchGoals}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </>
              )}
            </button>
            <a 
              href="/goals/define-smart"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Goal
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">
        {goals.length > 1 ? "My Goals" : goals.length === 1 ? "My Goal" : "Goals"}
      </h1>
      
      {/* Progress Overview Section */}
      <section className="grid gap-6 md:grid-cols-2">
        <ProgressTracker goals={goals} />
        <CompletedTasks goals={goals} />
      </section>

      {/* Goals Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Goals</h2>
        <CategoryTabs 
          categories={CATEGORIES.map(c => c.value)} 
          categoryCounts={categoryCounts}
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {goals.map((goal) => (
            <GoalCard 
              key={goal._id} 
              goal={goal} 
              onProgressUpdate={handleProgressUpdate}
              showCategory={showCategory}
              refreshGoals={refreshGoals}
            />
          ))}
        </div>
        
        {goals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No goals found. Create your first goal to get started!</p>
          </div>
        )}
      </section>

      {/* Recommendations Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recommended Goals</h2>
        <RecommendationsSection />
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
