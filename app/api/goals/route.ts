import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Goal } from "@/models/Goal";
import { goalSchema } from "@/lib/validations/goals";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    console.log("Received goal data:", body);

    // For development, use the provided userId if no session
    const userId = session?.user?.email || body.userId || "dev-user@example.com";
    console.log("Using userId:", userId);

    try {
      // Parse dates from ISO strings
      const dataWithDates = {
        ...body,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      };
      console.log("Data with parsed dates:", dataWithDates);

      const validatedData = goalSchema.parse(dataWithDates);
      console.log("Validated data:", validatedData);

      await connectToDatabase();
      console.log("Connected to database");

      const goal = await Goal.create({
        ...validatedData,
        userId,
        status: "not_started",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("Created goal:", goal);

      return NextResponse.json(goal, { status: 201 });
    } catch (validationError) {
      console.error("Validation error:", validationError);
      if (validationError instanceof Error) {
        return NextResponse.json(
          { 
            error: "Invalid goal data", 
            details: validationError.message,
            issues: validationError instanceof z.ZodError ? validationError.issues : undefined
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Invalid goal data", details: validationError },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { error: "Failed to create goal", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || session?.user?.email || "dev-user";
    const category = searchParams.get("category");

    console.log("Fetching goals for userId:", userId);

    await connectToDatabase();
    console.log("Connected to database");

    // Build query filter
    const filter: any = { userId };
    if (category && category !== "all") {
      filter.category = category;
    }

    // Get goals for this user
    const goals = await Goal.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    
    console.log("Found goals for user:", goals);

    // Calculate category counts
    const categoryCounts = await Goal.aggregate([
      {
        $match: { userId }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]).then(results => 
      results.reduce((acc, { _id, count }) => ({
        ...acc,
        [_id]: count
      }), {})
    );

    console.log("Category counts for user:", categoryCounts);

    return NextResponse.json({ goals, categoryCounts }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      }
    });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch goals", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
