'use client';

import Title from '@/components/title';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { auth, db } from '@/lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowRight, Loader, Mail, RectangleEllipsis } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { signInWithEmailAndPassword } from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get('signup') === 'success') {
      toast.success('Account Created', {
        description: 'Please log in to continue.',
      });
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const firstError = validation.error.issues[0].message;
      toast.error('Validation Error', { description: firstError });
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Check if email is verified
      if (!user.emailVerified) {
        toast.error('Email not verified. Please check your inbox.');
        router.push('/verification');
        return;
      }

      // ✅ Check if Firestore user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        router.push('/profile/create');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error('Login failed', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-sm bg-transparent border-0 sm:border-2 sm:bg-card flex flex-col gap-5">
        <CardHeader>
          <CardTitle>
            <Title>Sign In.</Title>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2.5">
              <Input
                placeholder="Email"
                leftIcon={<Mail />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <Input
                placeholder="Password"
                type="password"
                leftIcon={<RectangleEllipsis />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex px-1 items-center justify-between">
              <Checkbox label="Remember me" />
              <Link
                className="text-sm font-bold uppercase hover:underline text-primary"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex gap-5"
            >
              {isLoading ? 'LOGGING IN...' : 'ACCESS ACCOUNT'}
              {isLoading ? <Loader className="animate-spin" /> : <ArrowRight />}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-between items-center">
          <span className="text-md uppercase font-bold">
            Don't have an account?{' '}
          </span>
          <Link
            className="text-sm uppercase flex justify-center items-center border-2 bg-primary px-2 py-0 font-bold hover:underline text-black"
            href="/signup"
          >
            Register
          </Link>
        </CardFooter>
      </Card>
      <div className="absolute bottom-5">
        <p className="text-sm text-muted-foreground mt-4">
          By logging in, you agree to our{' '}
          <Link href="/terms" className="underline">
            Terms and Conditions
          </Link>
        </p>
      </div>
    </div>
  );
}
