export interface Workspace {
  id?: string;
  name: string;
  logo?: string;
  plan?: string;
  createdBy: string;
  createdAt?: any;
}

export interface NavItem {
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

export interface Project {
  name: string;
  url: string;
  icon?: any;
}

export interface AppData {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  workspaces: Workspace[];
  navMain: NavItem[];
  projects: Project[];
}

export const mockData: AppData = {
  user: { name: 'Loading...', email: '', avatar: '' },
  workspaces: [],
  navMain: [],
  projects: [],
};
