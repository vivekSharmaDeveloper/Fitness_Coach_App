import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { RecommendedGoal } from "@/models/RecommendedGoal";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || "dev-user";

    await connectToDatabase();

    // Get all goals for the user
    const goals = await RecommendedGoal.find({ userId });

    // Calculate goals statistics
    const goalsStats = {
      completed: goals.filter(goal => goal.status === "completed").length,
      inProgress: goals.filter(goal => goal.status === "in_progress").length,
      total: goals.length
    };

    // Mock daily progress data (replace with real data from your database)
    const dailyProgress = {
      steps: 7500,
      calories: 1800,
      water: 6,
      sleep: 7.5
    };

    // Mock weekly stats (replace with real data from your database)
    const weeklyStats = {
      workouts: 4,
      totalMinutes: 240,
      caloriesBurned: 1200
    };

    return NextResponse.json({
      dailyProgress,
      weeklyStats,
      goals: goalsStats
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
} 