import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { WorkoutLog } from "@/models/WorkoutLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { goalId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || "dev-user";
    const goalId = params.goalId;

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const activityName = searchParams.get("activityName");

    await connectToDatabase();

    // Build query
    const query: any = {
      userId,
      goalId,
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (activityName) {
      query.activityName = activityName;
    }

    // Fetch workout logs
    const logs = await WorkoutLog.find(query)
      .sort({ date: -1 })
      .limit(100);

    // Calculate statistics
    const stats = await WorkoutLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$activityName",
          totalAmount: { $sum: "$amountLogged" },
          averageAmount: { $avg: "$amountLogged" },
          totalEntries: { $sum: 1 },
          daysCompleted: {
            $sum: { $cond: ["$isDailyTargetMet", 1, 0] },
          },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      logs,
      stats,
    });
  } catch (error) {
    console.error("Error fetching workout history:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout history" },
      { status: 500 }
    );
  }
} 