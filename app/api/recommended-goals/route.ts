import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { RecommendedGoal } from "@/models/RecommendedGoal";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "dev-user"; // For development

    console.log("Fetching recommendations for user:", userId);

    await connectToDatabase();

    const recommendations = await RecommendedGoal.find({
      userId,
      $or: [
        { isAccepted: false },
        { status: "suggested" }
      ]
    }).sort({ createdAt: -1 });

    console.log("Found recommendations:", recommendations);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
} 