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
import { ArrowRight, Mail, RectangleEllipsis } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-sm flex border-none flex-col gap-5">
        <CardHeader>
          <CardTitle>
            <Title>Login.</Title>
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
            <div className="flex px-1 items-center justify-between">
              <Checkbox label="Remember me" />
              <Link
                className="text-sm font-bold uppercase hover:underline text-primary"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full flex gap-5">
              ACCESS ACCOUNT
              <ArrowRight />
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-between items-center">
          <span className=" text-md uppercase font-bold">
            Don't have an account?{' '}
          </span>
          <Link
            className="text-sm uppercase border-2 bg-primary px-1 py-0 font-bold hover:underline text-black"
            href="/register"
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

export default LoginPage;
