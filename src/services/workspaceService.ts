import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { Workspace } from '@/models/workspace';

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
  const ref = doc(db, 'workspaces', id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() } as Workspace;
}
