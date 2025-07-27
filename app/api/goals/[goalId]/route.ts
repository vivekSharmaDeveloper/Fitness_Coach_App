import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Goal } from "@/models/Goal";
import { goalSchema } from "@/lib/validations/goals";

export async function PUT(req, { params }) {
  await connectToDatabase();
  const { goalId } = params;
  const data = await req.json();
  try {
    // Only allow updating title, targetValue, category
    const updateData = {
      ...(data.title && { title: data.title }),
      ...(data.targetValue && { targetValue: data.targetValue }),
      ...(data.category && { category: data.category }),
      updatedAt: new Date(),
    };
    // Optionally validate
    // await goalSchema.partial().parseAsync(updateData);
    const updated = await Goal.findByIdAndUpdate(goalId, updateData, { new: true });
    if (!updated) return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    return NextResponse.json({ success: true, goal: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update goal" }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await connectToDatabase();
  const { goalId } = params;
  try {
    const deleted = await Goal.findByIdAndDelete(goalId);
    if (!deleted) return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to delete goal" }, { status: 400 });
  }
} 