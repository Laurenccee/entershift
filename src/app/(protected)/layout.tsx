'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
      } else {
        setIsAllowed(true);
      }
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-primary" />
      </div>
    );
  }

  return isAllowed ? <>{children}</> : null;
}
