import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { RecommendedGoal } from "@/models/RecommendedGoal";
import { Goal } from "@/models/Goal";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await req.json();
    const recommendationId = params.id;

    await connectToDatabase();

    // Find the recommendation
    const recommendation = await RecommendedGoal.findById(recommendationId);
    if (!recommendation) {
      return NextResponse.json(
        { error: "Recommendation not found" },
        { status: 404 }
      );
    }

    // Create a new goal from the recommendation
    const newGoal = await Goal.create({
      userId,
      title: recommendation.title,
      category: recommendation.category,
      specific: recommendation.description,
      measurable: "Track progress through the provided plan",
      achievable: "Based on your profile and preferences",
      relevant: "Aligned with your fitness goals",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      targetValue: 1,
      unit: "plan",
      status: "not_started",
      planDetails: recommendation.planDetails,
    });

    // Update the recommendation status
    recommendation.isAccepted = true;
    recommendation.status = "accepted";
    await recommendation.save();

    return NextResponse.json({
      message: "Recommendation accepted",
      goal: newGoal,
    });
  } catch (error) {
    console.error("Error accepting recommendation:", error);
    return NextResponse.json(
      { error: "Failed to accept recommendation" },
      { status: 500 }
    );
  }
} 