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
        {
            title: 'About',
            url: '/',
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: 'About developer',
                    url: '/about-developer',
                },
                {
                    title: 'About hero',
                    url: '/about-hero',
                },
                {
                    title: 'About Infos',
                    url: '/about-infos',
                },
                {
                    title: 'About Bunner First',
                    url: '/about-bunner-first',
                },
                {
                    title: 'About Bunner Second',
                    url: '/about-bunner-second',
                },
            ],
        },
        {
            title: 'Product',
            url: '/',
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: 'Product category',
                    url: '/product-category',
                },
            ],
        },
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
            icon: Bot,
        },
        {
            name: 'Translations',
            url: '/translations',
            icon: BookOpen,
        },
        {
            name: 'Contact Hero',
            url: '/contact-hero',
            icon: BookOpen,
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
        {
            name: 'Home Hero',
            url: '/home-hero',
            icon: AudioWaveform,
        },
        {
            name: 'Home Product bunner',
            url: '/Home-Product-bunner',
            icon: Command,
        },
        {
            name: 'Home Contact bunner',
            url: '/contact-bunner',
            icon: Command,
        },
        {
            name: 'Blogs',
            url: '/blogs',
            icon: Command,
        },
        {
            name: 'Contact infos',
            url: '/contact-infos',
            icon: Command,
        },
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
