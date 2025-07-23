import { auth } from '@/lib/firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';
import { useState } from 'react';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error('Login Failed', {
          description: data.error || 'Please try again.',
        });
        return false;
      }

      toast.success('Login Successful', {
        description: 'Redirecting to dashboard...',
      });
      return true;
    } catch (error: any) {
      toast.error('Error', {
        description: error.message || 'An unexpected error occurred.',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
}
