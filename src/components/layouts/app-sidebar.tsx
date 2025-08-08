'use client';

import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
  Users,
} from 'lucide-react';

import React, { useState, useEffect } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserData } from '@/services/userService';
import { getWorkspaceById } from '@/services/workspaceService';
import { UserModel } from '@/models/users';
import { Workspace } from '@/models/workspace';

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();
  const [user, setUser] = useState<UserModel | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeTeam, setActiveTeam] = useState<Workspace | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUserData(firebaseUser.uid);
        if (userData) {
          setUser(userData);

          // Fetch all workspaces for this user
          if (userData.workspaces && userData.workspaces.length > 0) {
            const wsData = await Promise.all(
              userData.workspaces.map((id) => getWorkspaceById(id))
            );
            const filtered = wsData.filter((w): w is Workspace => w !== null);
            setWorkspaces(filtered);
            setActiveTeam(filtered[0] || null);
          }
        }
      } else {
        setUser(null);
        setWorkspaces([]);
        setActiveTeam(null);
      }
    });

    return () => unsub();
  }, []);

  if (!user || !activeTeam) return null;

  const navItems = activeTeam
    ? [
        {
          title: 'Dashboard',
          url: `/workspace/${activeTeam.id}/dashboard`,
          icon: SquareTerminal,
        },
        {
          title: 'Projects',
          url: `/workspace/${activeTeam.id}/projects`,
          icon: Folder,
        },
        {
          title: 'Team',
          url: `/workspace/${activeTeam.id}/team`,
          icon: Users,
        },
        {
          title: 'Settings',
          url: `/workspace/${activeTeam.id}/settings`,
          icon: Settings2,
        },
      ]
    : [];

  console.log(user.photoURL);
  console.log(user.name);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus-visible:ring-0" asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:border-border data-[state=open]:bg-primary data-[state=open]:text-primary-foreground data-[state=open]:outline-border data-[state=open]:outline-2"
                >
                  <div className="flex aspect-square size-8 items-center justify-center">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate">{activeTeam.name}</span>
                    <span className="truncate text-sm">
                      {activeTeam.plan || 'Free'}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                align="start"
                side={isMobile ? 'bottom' : 'right'}
                sideOffset={4}
              >
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                {workspaces.map((ws, index) => (
                  <DropdownMenuItem
                    key={ws.id}
                    onClick={() => setActiveTeam(ws)}
                    className="gap-2 p-1.5"
                  >
                    <div className="flex size-6 items-center justify-center">
                      <GalleryVerticalEnd className="size-4 shrink-0" />
                    </div>
                    {ws.name}
                    <DropdownMenuShortcut>
                      <Command />
                      {index + 1}
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => (window.location.href = '/workspace/create')}
                >
                  <Plus className="size-4" />{' '}
                  <div className="font-base">Add workspace</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/${workspaceId}/dashboard">
                  <PieChart />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/settings">
                  <Settings2 />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#">
                  <Folder />
                  <span>Example Project</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:border-border data-[state=open]:bg-primary data-[state=open]:text-primary-foreground data-[state=open]:outline-border data-[state=open]:outline-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.photoURL}
                      alt={user?.name || 'User'}
                    />
                    <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-heading">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-base">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL} alt="CN" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-heading">{user.name}</span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
