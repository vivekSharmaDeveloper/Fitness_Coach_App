import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await req.json();

    // Update user with partial onboarding data (don't mark as completed)
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        ...data,
        // Don't set onboardingCompleted to true for partial saves
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Partial onboarding data saved successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error in partial onboarding API:', error);
    return NextResponse.json(
      { error: 'Failed to save partial onboarding data' },
      { status: 500 }
    );
  }
}
