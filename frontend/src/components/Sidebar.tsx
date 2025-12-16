'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User, Briefcase, Image as ImageIcon, Mail, Music, Home, Github, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/projects', label: 'Projects', icon: Briefcase },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    { href: '/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/contact', label: 'Contact', icon: Mail },
    { href: '/music', label: 'Music Player', icon: Music },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
    const pathname = usePathname();

    const sidebarContent = (
        <aside className="w-72 h-screen bg-[color:var(--color-background)] border-r border-[color:var(--color-purple-border)] p-4 flex flex-col gap-3 overflow-y-auto dashboard-scroll">
            {/* Profile Section */}
            <div
                className="bg-[color:var(--color-background)] border-2 border-[color:var(--color-purple-border)] rounded-2xl p-4 flex flex-col items-center gap-3 hover:border-[color:var(--color-purple-border-hover)] transition-all duration-300 hover:shadow-[0_0_20px_var(--color-glow)]"
                suppressHydrationWarning
            >
                <div
                    className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/40"
                    suppressHydrationWarning
                >
                    <Image
                        src="/profile.jpg"
                        alt="ASIF MAHMUD"
                        fill
                        className="object-cover"
                        suppressHydrationWarning
                    />
                </div>
                <div className="text-center" suppressHydrationWarning>
                    <h3 className="text-white font-bold text-sm">DEV ASIF</h3>
                    <p className="text-purple-300 text-xs">Full Stack Developer</p>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex flex-col gap-2 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                "group relative bg-[color:var(--color-background)] border-2 rounded-xl p-3 flex items-center gap-3 transition-all duration-300",
                                isActive
                                    ? "border-purple-500 shadow-[0_0_20px_var(--color-glow-strong)]"
                                    : "border-[color:var(--color-purple-border)] hover:border-[color:var(--color-purple-border-hover)] hover:shadow-[0_0_15px_var(--color-glow)]"
                            )}
                            suppressHydrationWarning
                        >
                            <Icon
                                className={cn(
                                    "w-5 h-5 transition-colors duration-300",
                                    isActive
                                        ? "text-purple-400"
                                        : "text-purple-500/70 group-hover:text-purple-400"
                                )}
                            />
                            <span
                                className={cn(
                                    "text-sm font-medium transition-colors duration-300",
                                    isActive
                                        ? "text-white"
                                        : "text-purple-200/80 group-hover:text-white"
                                )}
                            >
                                {item.label}
                            </span>

                            {/* Active indicator glow */}
                            {isActive && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/10 to-pink-600/10 pointer-events-none" suppressHydrationWarning />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Copyright Footer */}
            <div className="mt-auto pt-4 border-t border-purple-600/20" suppressHydrationWarning>
                <div className="text-center space-y-2" suppressHydrationWarning>
                    <p className="text-purple-300/60 text-xs">
                        © 2025 All rights reserved
                    </p>
                    <p className="text-purple-200/80 text-xs font-medium">
                        by Asif Mahmud
                    </p>
                    <a
                        href="https://github.com/oficialasif"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-xs"
                    >
                        <Github className="w-4 h-4" />
                        <span>@oficialasif</span>
                    </a>
                </div>
            </div>
        </aside>
    );

    return (
        <>
            {/* Desktop Sidebar - Always visible on large screens */}
            <div className="hidden lg:block">
                {sidebarContent}
            </div>

            {/* Mobile Sidebar - Slide in from left */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 left-0 z-50 lg:hidden"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
