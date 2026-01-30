import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import LandingPage from '@/components/LandingPage';

export default async function Home() {
  const { userId } = await auth();

  // If user is signed in, redirect to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  // Show landing page for non-authenticated users
  return <LandingPage />;
}
