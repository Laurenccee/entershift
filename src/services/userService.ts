import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { UserModel } from '@/models/users';

export async function getUserData(userId: string): Promise<UserModel | null> {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() } as UserModel;
}
