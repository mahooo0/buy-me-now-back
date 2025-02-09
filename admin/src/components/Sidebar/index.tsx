'use client';

import * as React from 'react';
import {
    AppWindow,
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Languages,
    SearchCheck,
    SquareTerminal,
} from 'lucide-react';

// import { NavMain } from '@/components/nav-main';
// import { NavProjects } from '@/components/nav-projects';
// import { NavUser } from '@/components/nav-user';
// import { TeamSwitcher } from '@/components/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { NavProjects } from './nav-projects';
import { TeamSwitcher } from './team-switcher';
import { useNavigate } from 'react-router-dom';

// This is sample data.
const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    teams: [
        {
            name: 'Acme Inc',
            logo: GalleryVerticalEnd,
            plan: 'Enterprise',
        },
        {
            name: 'Acme Corp.',
            logo: AudioWaveform,
            plan: 'Startup',
        },
        {
            name: 'Evil Corp.',
            logo: Command,
            plan: 'Free',
        },
    ],
    navMain: [
        // {
        //     title: 'Exsample',
        //     url: '/exmplCategory',
        //     icon: SquareTerminal,
        //     isActive: true,
        //     items: [
        //         {
        //             title: 'Category',
        //             url: '/exmplCategory',
        //         },
        //         {
        //             title: 'Sub Category',
        //             url: '/subCategory',
        //         },
        //         {
        //             title: 'Data Exsample',
        //             url: '/data',
        //         },
        //     ],
        // },
    ],
    projects: [
        {
            name: 'Dasboard',
            url: '/Dasboard',
            icon: Frame,
        },
        {
            name: 'Admin Users',
            url: '/users',
            icon: SquareTerminal,
        },
        {
            name: 'Translations',
            url: '/translations',
            icon: Languages,
        },
        {
            name: 'Seo',
            url: '/seo',
            icon: SearchCheck,
        },
        {
            name: 'FavIcon / Logo',
            url: '/icons',
            icon: AppWindow,
        },
        // {
        //     name: 'Exsample Category',
        //     url: '/exmplCategory',
        //     icon: AppWindow,
        // },
        // {
        //     name: 'Home hero',
        //     url: '/Home_hero',
        //     icon: AppWindow,
        // },
        // {
        //     name: 'Sales & Marketing',
        //     url: '#',
        //     icon: PieChart,
        // },
        // {
        //     name: 'Travel',
        //     url: '#',
        //     icon: Map,
        // },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const userstr = localStorage.getItem('adminUser');
    const navigate = useNavigate();
    if (userstr) {
        const user = JSON.parse(userstr);
        return (
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader className="h-[50px] flex justify-center items-start w-full overflow-hidden">
                    <div className="flex justify-center gap-2 md:justify-start">
                        <div className="flex items-center gap-4 font-medium text-nowrap">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <GalleryVerticalEnd className="size-4" />
                            </div>
                            Acme Inc.
                        </div>
                    </div>
                    {/* <TeamSwitcher teams={data.teams} /> */}
                </SidebarHeader>
                <SidebarContent>
                    <NavProjects projects={data.projects} />
                    <NavMain items={data.navMain} />
                </SidebarContent>
                <SidebarFooter>
                    <NavUser user={user} />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        );
    } else {
        function navigateToLogin() {
            navigate('/');
        }
        navigateToLogin();
    }
}
