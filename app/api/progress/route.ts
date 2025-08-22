import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Progress } from "@/models/Progress";
import { Goal } from "@/models/Goal";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { goalId, value, notes, date } = await req.json();

    if (!goalId || value === undefined) {
      return NextResponse.json(
        { error: "Goal ID and value are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const userId = session.user.email;

    // Verify the goal belongs to the user
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      return NextResponse.json(
        { error: "Goal not found" },
        { status: 404 }
      );
    }

    // Create or update progress entry for the date
    const progressDate = date ? new Date(date) : new Date();
    progressDate.setHours(0, 0, 0, 0); // Normalize to start of day

    const existingProgress = await Progress.findOne({
      userId,
      goalId,
      date: progressDate
    });

    let progressEntry;

    if (existingProgress) {
      // Update existing progress entry
      existingProgress.value = value;
      if (notes) existingProgress.notes = notes;
      progressEntry = await existingProgress.save();
    } else {
      // Create new progress entry
      progressEntry = new Progress({
        userId,
        goalId,
        date: progressDate,
        value,
        notes
      });
      await progressEntry.save();
    }

    // Recalculate goal's total progress from all progress entries
    const totalProgress = await Progress.aggregate([
      { $match: { userId, goalId } },
      { $group: { _id: null, total: { $sum: "$value" } } }
    ]);
    
    goal.currentProgress = totalProgress.length > 0 ? Math.min(totalProgress[0].total, goal.targetValue) : 0;
    
    // Update status based on progress
    if (goal.currentProgress >= goal.targetValue) {
      goal.status = "completed";
    } else if (goal.currentProgress > 0 && goal.status === "not_started") {
      goal.status = "in_progress";
    }

    await goal.save();

    return NextResponse.json({
      success: true,
      progress: progressEntry,
      goal: {
        id: goal._id,
        currentProgress: goal.currentProgress,
        status: goal.status
      }
    });

  } catch (error) {
    console.error("Progress API error:", error);
    return NextResponse.json(
      { error: "Failed to log progress" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const goalId = searchParams.get('goalId');
    const days = parseInt(searchParams.get('days') || '30');

    await connectToDatabase();

    const userId = session.user.email;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query: any = {
      userId,
      date: { $gte: startDate }
    };

    if (goalId) {
      query.goalId = goalId;
    }

    const progressEntries = await Progress.find(query).sort({ date: -1 });

    return NextResponse.json({
      success: true,
      progress: progressEntries
    });

  } catch (error) {
    console.error("Progress GET API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
