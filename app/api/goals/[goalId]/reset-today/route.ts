import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Goal } from "@/models/Goal";

export async function POST(req, { params }) {
  await connectToDatabase();
  const { goalId } = params;
  try {
    const updated = await Goal.findByIdAndUpdate(goalId, { currentProgress: 0, updatedAt: new Date() }, { new: true });
    if (!updated) return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    return NextResponse.json({ success: true, goal: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to reset progress" }, { status: 400 });
  }
} 