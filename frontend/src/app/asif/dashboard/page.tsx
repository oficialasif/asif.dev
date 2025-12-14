'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FolderKanban, Image, Music, Heart, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#8b5cf6', '#a78bfa', '#c084fc', '#e879f9', '#f0abfc'];

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, analyticsRes] = await Promise.all([
                api.stats.getOverview(),
                api.stats.getAnalytics(),
            ]);
            setStats(statsRes.data.data.stats);
            setAnalytics(analyticsRes.data.data.analytics);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const statCards = [
        {
            name: 'Total Projects',
            value: stats?.projectsCount || 0,
            icon: FolderKanban,
            color: 'from-purple-600 to-purple-400',
        },
        {
            name: 'Gallery Images',
            value: stats?.galleryCount || 0,
            icon: Image,
            color: 'from-pink-600 to-pink-400',
        },
        {
            name: 'Music Tracks',
            value: stats?.musicCount || 0,
            icon: Music,
            color: 'from-indigo-600 to-indigo-400',
        },
        {
            name: 'Interests',
            value: stats?.interestsCount || 0,
            icon: Heart,
            color: 'from-violet-600 to-violet-400',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
                <p className="text-purple-100">Manage your portfolio content and customize your site</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-400">{stat.name}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Projects by Technology */}
                <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Projects by Technology</h3>
                    {analytics?.projectsByTech && analytics.projectsByTech.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.projectsByTech}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e1e30',
                                        border: '1px solid #8b5cf6',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-400">
                            No data available
                        </div>
                    )}
                </div>

                {/* Gallery Uploads Over Time */}
                <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Gallery Uploads (Last 6 Months)</h3>
                    {analytics?.galleryByMonth && analytics.galleryByMonth.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.galleryByMonth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="_id" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e1e30',
                                        border: '1px solid #8b5cf6',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Bar dataKey="count" fill="#c084fc" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-400">
                            No data available
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a
                        href="/asif/dashboard/projects"
                        className="p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-center transition-all"
                    >
                        <FolderKanban className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-white">Add Project</p>
                    </a>
                    <a
                        href="/asif/dashboard/gallery"
                        className="p-4 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-lg text-center transition-all"
                    >
                        <Image className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-white">Upload Image</p>
                    </a>
                    <a
                        href="/asif/dashboard/theme"
                        className="p-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-center transition-all"
                    >
                        <TrendingUp className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-white">Customize Theme</p>
                    </a>
                    <a
                        href="/asif/dashboard/settings"
                        className="p-4 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 rounded-lg text-center transition-all"
                    >
                        <Heart className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-white">Site Settings</p>
                    </a>
                </div>
            </div>
        </div>
    );
}
