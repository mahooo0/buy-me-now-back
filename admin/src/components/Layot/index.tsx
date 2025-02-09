import React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { AppSidebar } from '../Sidebar';
import { Separator } from '@radix-ui/react-separator';
import { LanguageSwitcher } from '../LanguageSelect';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className=" ">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ">
                    <div className="flex items-center gap-2 px-10     justify-between w-full">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <div className="w-fit ">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
