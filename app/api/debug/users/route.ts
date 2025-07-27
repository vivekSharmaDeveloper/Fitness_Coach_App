import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET() {
  try {
    console.log('Debug: Fetching all users...');
    await connectToDatabase();
    
    // Get all users but exclude passwords
    const users = await User.find({}, { password: 0 }).lean();
    
    console.log('Debug: Found users:', users.length);
    
    return NextResponse.json({
      message: 'Users fetched successfully',
      count: users.length,
      users: users.map((user: any) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
