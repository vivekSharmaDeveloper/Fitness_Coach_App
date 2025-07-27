'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
        <p className="mb-4">You need to be logged in to view this page.</p>
        <button 
          onClick={() => router.push('/login')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      <div className="bg-green-100 p-4 rounded mb-4">
        <h2 className="font-semibold">✅ Authentication Successful!</h2>
        <p className="text-sm mt-2">
          <strong>Name:</strong> {session.user?.name}<br/>
          <strong>Email:</strong> {session.user?.email}<br/>
          <strong>Image:</strong> {session.user?.image || 'None'}
        </p>
      </div>
      
      <div className="space-y-2">
        <button 
          onClick={() => router.push('/dashboard')}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Dashboard
        </button>
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
