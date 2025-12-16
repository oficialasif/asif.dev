'use client';

import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ReactNode, useState, useEffect } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

    return (
        <div className="flex h-screen overflow-hidden bg-[color:var(--color-background)]">
            <MobileNav isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />
            <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
            <div className="flex-1 overflow-y-auto dashboard-scroll">
                {children}
            </div>
        </div>
    );
};
