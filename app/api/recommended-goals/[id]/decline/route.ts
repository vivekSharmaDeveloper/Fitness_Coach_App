import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { RecommendedGoal } from "@/models/RecommendedGoal";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recommendationId = params.id;

    await connectToDatabase();

    // Find and update the recommendation
    const recommendation = await RecommendedGoal.findById(recommendationId);
    if (!recommendation) {
      return NextResponse.json(
        { error: "Recommendation not found" },
        { status: 404 }
      );
    }

    // Update status to declined
    recommendation.status = "declined";
    await recommendation.save();

    return NextResponse.json({
      message: "Recommendation declined",
    });
  } catch (error) {
    console.error("Error declining recommendation:", error);
    return NextResponse.json(
      { error: "Failed to decline recommendation" },
      { status: 500 }
    );
  }
} 