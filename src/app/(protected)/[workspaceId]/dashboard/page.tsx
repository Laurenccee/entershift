'use client';

import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mb-4">Welcome to your dashboard!</p>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}

export default Dashboard;
