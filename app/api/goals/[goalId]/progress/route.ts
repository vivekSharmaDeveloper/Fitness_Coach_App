import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Define the Goal schema
const goalSchema = new mongoose.Schema({
  title: String,
  category: String,
  targetValue: Number,
  unit: String,
  currentProgress: Number,
  startDate: Date,
  endDate: Date,
  status: String,
  userId: String,
  createdAt: Date,
  updatedAt: Date
});

// Create the model if it doesn't exist
const Goal = mongoose.models.Goal || mongoose.model('Goal', goalSchema);

// Helper function to check if a date is from a previous day
function isFromPreviousDay(date: Date): boolean {
  const now = new Date();
  return (
    date.getDate() !== now.getDate() ||
    date.getMonth() !== now.getMonth() ||
    date.getFullYear() !== now.getFullYear()
  );
}

// Helper function to reset daily progress
function resetDailyProgress(activity: any) {
  activity.currentProgress = 0;
  activity.isDailyTargetMet = false;
  activity.lastUpdatedDate = new Date();
}

export async function POST(
  req: Request,
  { params }: { params: { goalId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || "dev-user";
    const goalId = params.goalId;
    const { progress } = await req.json();

    if (typeof progress !== 'number' || progress < 0) {
      return NextResponse.json(
        { error: "Invalid progress value" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the goal and verify ownership
    const goal = await Goal.findOne({
      _id: goalId,
      userId,
    });

    if (!goal) {
      return NextResponse.json(
        { error: "Goal not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update progress
    goal.currentProgress = progress;
    goal.isDailyTargetMet = progress >= goal.targetValue;
    goal.lastUpdatedDate = new Date();

    // Save the updated goal
    await goal.save();

    return NextResponse.json({
      success: true,
      goal: goal.toObject(),
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

// Add a GET endpoint to check if progress needs to be reset
export async function GET(
  req: Request,
  { params }: { params: { goalId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || "dev-user";
    const goalId = params.goalId;

    await connectToDatabase();

    const goal = await Goal.findOne({
      _id: goalId,
      userId,
    });

    if (!goal) {
      return NextResponse.json(
        { error: "Goal not found or unauthorized" },
        { status: 404 }
      );
    }

    // Check if we need to reset daily progress
    const lastUpdated = new Date(goal.lastUpdatedDate);
    const now = new Date();
    const isFromPreviousDay =
      lastUpdated.getDate() !== now.getDate() ||
      lastUpdated.getMonth() !== now.getMonth() ||
      lastUpdated.getFullYear() !== now.getFullYear();

    if (isFromPreviousDay) {
      goal.currentProgress = 0;
      goal.isDailyTargetMet = false;
      goal.lastUpdatedDate = new Date();
      await goal.save();
    }

    return NextResponse.json({
      success: true,
      goal: goal.toObject(),
    });
  } catch (error) {
    console.error("Error checking progress reset:", error);
    return NextResponse.json(
      { error: "Failed to check progress reset" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { goalId: string } }
) {
  try {
    const { goalId } = params;
    const { progress } = await request.json();

    if (!goalId || typeof progress !== "number") {
      return NextResponse.json(
        { error: "Invalid goal ID or progress value" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Update the goal
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(goalId) },
      { 
        $set: { 
          currentProgress: progress,
          updatedAt: new Date()
        } 
      },
      { new: true }
    );

    if (!updatedGoal) {
      console.log("Failed to update goal");
      return NextResponse.json(
        { error: "Failed to update goal" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      goal: {
        _id: updatedGoal._id,
        currentProgress: updatedGoal.currentProgress,
        updatedAt: updatedGoal.updatedAt
      }
    });
  } catch (error) {
    console.error("Error updating goal progress:", error);
    
    // Handle specific error types
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { error: "Invalid goal ID format" },
        { status: 400 }
      );
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "Invalid progress value" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update goal progress" },
      { status: 500 }
    );
  }
} 