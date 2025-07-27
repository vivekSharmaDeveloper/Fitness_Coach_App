import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { UserPreference } from '@/models/UserPreference';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id || session.user.email;

    await connectDB();
    const data = await req.json();

    // Create or update user preferences
    const userPreference = await UserPreference.findOneAndUpdate(
      { userId },
      {
        userId,
        ...data,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return NextResponse.json({
      message: 'Onboarding completed successfully',
      userPreference,
    });
  } catch (error) {
    console.error('Error in onboarding API:', error);
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    );
  }
} 