'use client';

import { Sidebar } from './Sidebar';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="flex h-screen overflow-hidden bg-[color:var(--color-background)]">
            <Sidebar />
            <div className="flex-1 overflow-y-auto dashboard-scroll">
                {children}
            </div>
        </div>
    );
};
