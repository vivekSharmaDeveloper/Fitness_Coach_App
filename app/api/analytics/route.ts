import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Goal } from "@/models/Goal";
import { Progress } from "@/models/Progress";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths, format } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const userId = session.user.email;
    const now = new Date();
    
    // Get all user goals
    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
    
    // Get progress data for the last 30 days
    const thirtyDaysAgo = subDays(now, 30);
    const progressData = await Progress.find({
      userId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });

    // Calculate goal completion rates
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => goal.status === "completed").length;
    const inProgressGoals = goals.filter(goal => goal.status === "in_progress").length;
    const notStartedGoals = goals.filter(goal => goal.status === "not_started").length;
    const abandonedGoals = goals.filter(goal => goal.status === "abandoned").length;

    // Calculate completion rate
    const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    // Calculate average progress for in-progress goals
    const avgProgress = inProgressGoals > 0 
      ? goals
          .filter(goal => goal.status === "in_progress")
          .reduce((sum, goal) => sum + (goal.currentProgress / goal.targetValue * 100), 0) / inProgressGoals
      : 0;

    // Generate weekly progress data for last 8 weeks
    const weeklyData = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(now, i));
      const weekEnd = endOfWeek(subWeeks(now, i));
      
      const weekProgress = progressData.filter(p => 
        p.date >= weekStart && p.date <= weekEnd
      );
      
      const totalValue = weekProgress.reduce((sum, p) => sum + p.value, 0);
      
      weeklyData.push({
        week: format(weekStart, "MMM dd"),
        value: totalValue,
        entries: weekProgress.length
      });
    }

    // Generate monthly progress data for last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = endOfMonth(subMonths(now, i));
      
      const monthProgress = progressData.filter(p => 
        p.date >= monthStart && p.date <= monthEnd
      );
      
      const totalValue = monthProgress.reduce((sum, p) => sum + p.value, 0);
      
      monthlyData.push({
        month: format(monthStart, "MMM yyyy"),
        value: totalValue,
        entries: monthProgress.length
      });
    }

    // Calculate streak data (consecutive days with progress)
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(now, i);
      const dayProgress = progressData.filter(p => 
        format(p.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      );
      
      last30Days.push({
        date: format(date, "yyyy-MM-dd"),
        hasProgress: dayProgress.length > 0,
        value: dayProgress.reduce((sum, p) => sum + p.value, 0),
        entries: dayProgress.length
      });
    }

    // Calculate current streak
    let currentStreak = 0;
    for (let i = last30Days.length - 1; i >= 0; i--) {
      if (last30Days[i].hasProgress) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak in the last 30 days
    let longestStreak = 0;
    let tempStreak = 0;
    for (const day of last30Days) {
      if (day.hasProgress) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Goals by category
    const goalsByCategory = goals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Recent achievements (goals completed in last 30 days)
    const recentAchievements = goals.filter(goal => 
      goal.status === "completed" && 
      goal.updatedAt >= thirtyDaysAgo
    ).length;

    return NextResponse.json({
      overview: {
        totalGoals,
        completedGoals,
        inProgressGoals,
        notStartedGoals,
        abandonedGoals,
        completionRate: Math.round(completionRate * 100) / 100,
        avgProgress: Math.round(avgProgress * 100) / 100,
        recentAchievements
      },
      charts: {
        weekly: weeklyData,
        monthly: monthlyData,
        goalsByCategory: Object.entries(goalsByCategory).map(([category, count]) => ({
          category: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          count
        }))
      },
      streaks: {
        current: currentStreak,
        longest: longestStreak,
        calendar: last30Days
      }
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
