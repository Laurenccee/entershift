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
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, RectangleEllipsis, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-sm flex border-none flex-col gap-5">
        <CardHeader>
          <CardTitle>
            <Title>Sign Up.</Title>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              <Input placeholder="Email" leftIcon={<Mail />} />
              <Input
                placeholder="Password"
                type="password"
                leftIcon={<RectangleEllipsis />}
              />
            </div>
            <Button type="submit" className="w-full flex gap-5">
              REGISTER
              <ArrowRight />
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
