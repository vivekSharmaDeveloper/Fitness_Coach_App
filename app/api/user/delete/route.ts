import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required to delete account" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // For OAuth users (no password), allow deletion with any password confirmation
    if (user.password) {
      // Verify password for regular users
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Incorrect password" },
          { status: 400 }
        );
      }
    }

    // Delete user and all associated data
    // Note: In a production app, you might want to also delete related data from other collections
    // like goals, progress tracking, etc.
    
    // First, let's check if there are any goals to delete
    try {
      // If you have a Goal model, import and delete goals
      // const Goal = require('@/models/Goal');
      // await Goal.deleteMany({ userId: user._id });
      
      // Delete the user
      await User.deleteOne({ email: session.user.email });
      
      return NextResponse.json({ 
        message: "Account deleted successfully" 
      });
      
    } catch (deleteError) {
      console.error("Error during account deletion:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete account. Please try again." },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
