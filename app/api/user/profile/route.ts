import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

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
    
    const user = await User.findOne({ email: session.user.email }).select('-password -resetPasswordToken');
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
        onboardingCompleted: user.onboardingCompleted,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
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

    const { name, image } = await request.json();

    await connectToDatabase();
    
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        name,
        image,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password -resetPasswordToken');

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      emailVerified: updatedUser.emailVerified,
      onboardingCompleted: updatedUser.onboardingCompleted,
      lastLogin: updatedUser.lastLogin,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    });

  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
