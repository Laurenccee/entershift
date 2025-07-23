'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Loader } from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && (pathname === '/login' || pathname === '/signup')) {
        router.replace('/dashboard');
      } else {
        setIsAllowed(true);
      }
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (isChecking) {
    // Show only loader (or blank screen) until auth check finishes
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-primary" />
      </div>
    );
  }

  return <>{isAllowed && children}</>;
}
