import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { UserPreference } from "@/models/UserPreference";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const preferences = await UserPreference.findOne({ userId: session.user.email });
    
    if (!preferences) {
      // Return default preferences if none exist
      return NextResponse.json({
        goals: [],
        goalImportance: 3,
        successDefinition: "",
        sleepHours: 7,
        sleepQuality: "Good",
        consistentSleep: false,
        eatingHabits: "Balanced",
        waterIntake: 6,
        physicalActivity: "2-3 times",
        stressLevel: "Moderate",
        relaxationFrequency: "A few times a week",
        mindfulnessPractice: false,
        screenTime: 4,
        mindlessScrolling: false,
        existingGoodHabits: [],
        habitsToBreak: [],
        obstacles: [],
        disciplineLevel: 3,
        peakProductivityTime: "Morning",
        reminderPreference: "Push notifications",
        habitApproach: "Start small and build up gradually",
        dailyTimeCommitment: "15-30 mins",
        motivationFactors: []
      });
    }

    return NextResponse.json(preferences);

  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();

    await connectToDatabase();
    
    const updatedPreferences = await UserPreference.findOneAndUpdate(
      { userId: session.user.email },
      { 
        ...data,
        userId: session.user.email,
        updatedAt: new Date()
      },
      { 
        new: true, 
        upsert: true // Create if doesn't exist
      }
    );

    return NextResponse.json(updatedPreferences);

  } catch (error) {
    console.error("Error updating user preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
