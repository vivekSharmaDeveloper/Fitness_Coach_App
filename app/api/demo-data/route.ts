import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Progress } from "@/models/Progress";
import { Goal } from "@/models/Goal";
import { subDays, format } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const userId = session.user.email;
    
    // Get user's goals
    const goals = await Goal.find({ userId }).limit(5);
    
    if (goals.length === 0) {
      return NextResponse.json(
        { error: "No goals found. Create some goals first." },
        { status: 400 }
      );
    }

    const progressEntries = [];
    const now = new Date();

    // Generate sample progress data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = subDays(now, i);
      date.setHours(0, 0, 0, 0);

      // Randomly assign progress to some goals on some days
      for (const goal of goals) {
        // 70% chance of progress on any given day
        if (Math.random() > 0.3) {
          const maxDailyProgress = goal.targetValue / 30; // Assume goal should be completed in ~30 days
          const progressValue = Math.random() * maxDailyProgress * 2; // Some variation
          
          const existingProgress = await Progress.findOne({
            userId,
            goalId: goal._id,
            date
          });

          if (!existingProgress) {
            const progressEntry = new Progress({
              userId,
              goalId: goal._id,
              date,
              value: Math.round(progressValue * 100) / 100, // Round to 2 decimal places
              notes: `Sample progress for ${format(date, 'MMM dd')}`
            });
            
            await progressEntry.save();
            progressEntries.push(progressEntry);
          }
        }
      }
    }

    // Update goal progress based on the sample data
    for (const goal of goals) {
      const totalProgress = await Progress.aggregate([
        { $match: { userId, goalId: goal._id } },
        { $group: { _id: null, total: { $sum: "$value" } } }
      ]);
      
      goal.currentProgress = totalProgress.length > 0 
        ? Math.min(totalProgress[0].total, goal.targetValue) 
        : 0;
      
      // Update status based on progress
      if (goal.currentProgress >= goal.targetValue) {
        goal.status = "completed";
      } else if (goal.currentProgress > 0 && goal.status === "not_started") {
        goal.status = "in_progress";
      }

      await goal.save();
    }

    return NextResponse.json({
      success: true,
      message: `Created ${progressEntries.length} sample progress entries`,
      entriesCreated: progressEntries.length,
      goalsUpdated: goals.length
    });

  } catch (error) {
    console.error("Demo data API error:", error);
    return NextResponse.json(
      { error: "Failed to create demo data" },
      { status: 500 }
    );
  }
}
