export interface UserModel {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  workspaces?: string[];
  role?: string;
  createdAt?: any;
  updatedAt?: any;
}

// Optional: placeholder while loading
export const user: UserModel = {
  id: '',
  name: 'Loading...',
  email: '',
  photoURL: '',
  workspaces: [],
};
