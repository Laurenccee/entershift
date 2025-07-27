'use client';

import { useState, useEffect, DragEvent, ChangeEvent, FormEvent } from 'react';
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
import { ArrowRight, Loader, User, Upload, Phone } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/firebase';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { NumberSelection } from '@/components/num-selection';

function ProfileSetupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState(''); // ✅ Phone number
  const [countryCode, setCountryCode] = useState('+63'); // ✅ Default country
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const router = useRouter();

  /** Cleanup preview URL */
  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  /** Handle photo selection */
  const handlePhotoChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setPhotoFile(file);
      setPreviewURL(URL.createObjectURL(file));
    } else {
      toast.error('Invalid File: Please select a valid image file.');
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handlePhotoChange(e.target.files?.[0] || null);
  };

  /** Drag & Drop handlers */
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handlePhotoChange(file || null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  /** Upload to Supabase */
  const uploadToSupabase = async (file: File, userId: string) => {
    const filePath = `${userId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  /** Handle form submit */
  const handleProfileSetup = async (e: FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      toast.error('Missing Fields: Please enter your first and last name.');
      return;
    }

    if (!phone) {
      toast.error('Missing Fields: Please enter your phone number.');
      return;
    }

    if (!/^\d+$/.test(phone)) {
      toast.error('Invalid Phone: Please enter only numbers.');
      return;
    }

    try {
      setIsLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const displayName = `${firstName} ${lastName}`.trim();
      let photoURL = null;

      if (photoFile) {
        photoURL = await uploadToSupabase(photoFile, user.uid);
      }

      await updateProfile(user, {
        displayName,
        photoURL: photoURL || user.photoURL,
      });

      await setDoc(doc(db, 'users', user.uid), {
        name: displayName,
        email: user.email,
        phone: `${countryCode}${phone}`, // ✅ Save full number
        photoURL,
        createdAt: serverTimestamp(),
      });

      toast.success(
        'Profile Updated: Your profile has been successfully set up.'
      );
      console.log('fullname:', displayName);
      console.log('number:', countryCode, phone);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Profile setup failed:', err);
      toast.error(
        'Profile Setup Failed: ' + (err.message || 'An error occurred.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-xl bg-white border-0 sm:border-2 sm:bg-card">
        <CardHeader className="text-center">
          <CardTitle>
            <Title>Profile Setup</Title>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleProfileSetup}>
            {/* ID Card Container */}
            <div className="flex flex-col sm:flex-row gap-6 items-stretch">
              {/* Profile Picture */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`flex flex-1 aspect-square items-center justify-center overflow-hidden  border-2 transition ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-dashed border-gray-900 bg-white'
                }`}
                role="button"
              >
                {previewURL ? (
                  <img
                    src={previewURL}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center text-blue-500 text-sm w-full h-full">
                    <Upload size={20} />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                )}
              </div>

              {/* Info Fields */}
              <div className="flex flex-col gap-3 flex-1">
                <Input
                  placeholder="First Name"
                  leftIcon={<User />}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Input
                  placeholder="Last Name"
                  leftIcon={<User />}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <div className="flex items-center gap-2">
                  <div className="w-[100px]">
                    <NumberSelection
                      onSelect={(val: string) => setCountryCode(val)}
                    />
                  </div>
                  <Input
                    placeholder="Phone Number"
                    leftIcon={<Phone />}
                    className="w-full"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ''))
                    }
                    disabled={isLoading}
                    required
                  />
                </div>
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

export default ProfileSetupPage;
