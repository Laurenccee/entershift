// app/[workspaceId]/layout.tsx

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layouts/app-sidebar';
import React from 'react';
import type { ReactNode } from 'react';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
