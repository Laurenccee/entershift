'use client';

import React, { useEffect, useState } from 'react';
import Title from '@/components/title';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { IdCard, Mail, RefreshCw, LogOut, ArrowLeft } from 'lucide-react';
import {
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function VerificationPage() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState('');

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email || '');
        await user.reload();
        setIsVerified(user.emailVerified);
      } else {
        router.replace('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!isVerified && auth.currentUser) {
      const interval = setInterval(async () => {
        await auth.currentUser?.reload();
        if (auth.currentUser?.emailVerified) {
          setIsVerified(true);
          clearInterval(interval);
          router.replace('/profile-setup');
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isVerified, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  const handleResend = async () => {
    if (!auth.currentUser) return;
    setProcessing(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success('Verification email has been resent!', {
        description: 'Please check your inbox and click the link to verify.',
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to resend email.', {
        description: 'Please try again later.',
      });
    }
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-primary-foreground font-semibold animate-pulse">
          Checking your status...
        </p>
      </div>
    );
  }

  return (
    <div className="flex relative items-center justify-center h-screen p-4">
      <Button
        className="absolute hover:text-destructive top-4 left-4 z-10 flex gap-2.5"
        variant="ghost"
        onClick={handleLogout}
      >
        <ArrowLeft /> Logout
      </Button>

      <Card className="w-full max-w-sm bg-transparent border-0 sm:border-2 sm:bg-card flex flex-col gap-5 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>
            <Title>
              {isVerified ? 'Email Verified!' : 'Verify Your Email!'}
            </Title>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center text-center gap-3">
          <p className="text-sm font-bold">
            {isVerified
              ? 'Congratulations! Your email is verified. Redirecting...'
              : "We've sent a verification link to your email. Please check your inbox and click the link to verify your account."}
          </p>
          <p className="text-xs text-gray-500">Email: {email}</p>
        </CardContent>

        {!isVerified && (
          <CardFooter className="flex flex-col gap-3">
            <Button
              className="w-full uppercase flex gap-2.5"
              onClick={handleResend}
              disabled={processing}
            >
              Resend Verification <Mail className="w-4 h-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default VerificationPage;
