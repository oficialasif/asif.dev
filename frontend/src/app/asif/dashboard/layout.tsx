'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    User,
    Briefcase,
    Image as ImageIcon,
    Music,
    BookOpen,
    Bell,
    Palette,
    Settings,
    LogOut,
    Menu,
    X,
    Mail,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const navigation = [
    { name: 'Dashboard', href: '/asif/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/asif/dashboard/profile', icon: User },
    { name: 'Projects', href: '/asif/dashboard/projects', icon: Briefcase },
    { name: 'Gallery', href: '/asif/dashboard/gallery', icon: ImageIcon },
    { name: 'Contact', href: '/asif/dashboard/contact', icon: Mail },
    { name: 'Music', href: '/asif/dashboard/music', icon: Music },
    { name: 'Blog', href: '/asif/dashboard/blog', icon: BookOpen },
    { name: 'Notices', href: '/asif/dashboard/notices', icon: Bell },
    { name: 'Theme', href: '/asif/dashboard/theme', icon: Palette },
    { name: 'Settings', href: '/asif/dashboard/settings', icon: Settings },
];

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/asif/login');
            return;
        }

        // Get user info
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [router]);

    const handleLogout = async () => {
        try {
            await api.auth.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            toast.success('Logged out successfully');
            router.push('/asif/login');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]" suppressHydrationWarning>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" suppressHydrationWarning></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#1e1e30] border-r border-purple-500/20 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-purple-500/20">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                DEV ASIF
                            </h1>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                        : 'text-gray-400 hover:bg-purple-500/10 hover:text-white'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User & Logout */}
                    <div className="p-4 border-t border-purple-500/20">
                        <div className="flex items-center gap-3 mb-3 px-4 py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                                {user.username?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user.username}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-[#1e1e30]/80 backdrop-blur-lg border-b border-purple-500/20">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-semibold text-white">
                            {navigation.find((item) => item.href === pathname)?.name || 'Dashboard'}
                        </h2>
                        <div className="w-10 lg:w-0" /> {/* Spacer for mobile */}
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
