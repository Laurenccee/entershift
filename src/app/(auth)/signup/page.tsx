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
import { Input } from '@/components/ui/input';
import { Mail, RectangleEllipsis, ArrowRight, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/firebase';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signupSchema = z
    .object({
      email: z.string().email('Please enter a valid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string().min(6),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });

  const handleSignup = async () => {
    const validation = signupSchema.safeParse({
      email,
      password,
      confirmPassword,
    });
    if (!validation.success) {
      const firstError = validation.error.issues[0].message;
      toast.error('Validation Error', {
        description: firstError,
      });
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: null, // Will be set in profile setup
        createdAt: new Date(),
      });

      router.push('/profile-setup');
    } catch (error: any) {
      console.error(error.message);
      toast.error('Signup failed', { description: error.message });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-sm bg-transparent border-0 sm:border-2 sm:bg-card flex flex-col gap-5">
        <CardHeader>
          <CardTitle>
            <Title>Sign Up.</Title>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={handleSignup}>
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
              <Input
                placeholder="Confirm Password"
                type="password"
                leftIcon={<RectangleEllipsis />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full flex gap-5"
              disabled={isLoading}
            >
              {isLoading ? 'REGISTERING...' : 'REGISTER'}
              {isLoading ? <Loader className="animate-spin" /> : <ArrowRight />}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-between items-center">
          <span className=" text-md uppercase font-bold">
            Already have an account?
          </span>
          <Link
            className="text-sm uppercase border-2 bg-primary px-2 py-0 font-bold hover:underline text-black"
            href="/login"
          >
            Login
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

export default SignupPage;
