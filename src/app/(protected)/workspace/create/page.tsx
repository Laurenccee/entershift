'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Title from '@/components/title';
import { ArrowRight, Loader, Briefcase, Building2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

import { db } from '@/lib/firebase/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth } from '@/lib/firebase/firebase';

function WorkSpaceSetupPage() {
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [school, setSchool] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!auth.currentUser) {
      toast.error('You must be logged in to create a workspace.');
      return;
    }

    setIsLoading(true);

    try {
      const workspaceData = {
        name,
        organization,
        school: role === 'student' ? school : '',
        role,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'workspaces'), workspaceData);
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        workspaces: arrayUnion(docRef.id),
      });

      toast.success('Workspace created successfully!');
      router.push(`/${docRef.id}`); // Redirect to the workspace page
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast.error('Failed to create workspace. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md bg-white border-0 sm:border-2 sm:bg-card">
        <CardHeader className="text-center">
          <CardTitle>
            <Title>Create Workspace</Title>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-6 items-stretch">
              <div className="flex flex-col gap-3 flex-1">
                <Input
                  placeholder="Workspace's Name"
                  leftIcon={<Briefcase />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Input
                  placeholder="Institution/Company"
                  leftIcon={<Building2 />}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  disabled={isLoading}
                  required
                />
                {role === 'student' && (
                  <Input
                    placeholder="School"
                    leftIcon={<Building2 />}
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                )}
                <Select onValueChange={setRole} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="adviser">Advisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <CardFooter className="px-0 mt-4">
              <Button
                type="submit"
                className="w-full flex gap-4"
                disabled={isLoading}
              >
                {isLoading ? 'SAVING...' : 'CONTINUE'}
                {isLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <ArrowRight />
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default WorkSpaceSetupPage;
