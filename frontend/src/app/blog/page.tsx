'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Calendar, User, Clock, Eye, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/Card';


import { api } from '@/lib/api';

export default function BlogPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [showPill, setShowPill] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const totalReads = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.blog.getAll();
                setBlogs(response.data.data.blogs || response.data.data || []);
            } catch (error) {
                console.error('Failed to fetch blogs:', error);
            }
        };
        fetchBlogs();
    }, []);

    // Handle scroll to show/hide pill
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const scrollTop = containerRef.current.scrollTop;
                setShowPill(scrollTop > 200);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <DashboardLayout>
            {/* Sticky Pill Header */}
            <div
                className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${showPill
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-10 pointer-events-none'
                    }`}
            >
                <div className="bg-purple-900/80 backdrop-blur-xl border border-purple-500/30 rounded-full px-8 py-3 shadow-2xl shadow-purple-500/20">
                    <div className="flex items-center gap-6 text-sm">
                        <span className="text-white font-semibold">Blog</span>
                        <div className="w-px h-4 bg-purple-500/30"></div>
                        <span className="text-purple-100/80">
                            <span className="font-semibold text-purple-300">{blogs.length}</span> Articles
                        </span>
                        <div className="w-px h-4 bg-purple-500/30"></div>
                        <span className="text-purple-100/80 flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="font-semibold text-purple-300">{totalReads.toLocaleString()}</span> Reads
                        </span>
                    </div>
                </div>
            </div>

            {/* Scrollable Container */}
            <div
                ref={containerRef}
                className="h-screen overflow-y-auto"
                style={{ scrollbarWidth: 'thin' }}
            >
                <div className="space-y-4 sm:space-y-6 md:space-y-8 p-3 sm:p-4 md:p-6 pt-16 lg:pt-6">
                    {/* Page Header */}
                    <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />
                            <div className="text-center sm:text-left">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Blog</h1>
                                <p className="text-sm sm:text-base text-purple-100/70 mt-1 sm:mt-2">Thoughts, tutorials, and insights on web development</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6 justify-center sm:justify-start">
                            <div className="px-3 sm:px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                                <span className="text-purple-100 font-semibold">{blogs.length}</span>
                                <span className="text-purple-100/60 ml-2 text-xs sm:text-sm">Articles</span>
                            </div>
                            <div className="px-3 sm:px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                                <span className="text-purple-100 font-semibold">
                                    {totalReads.toLocaleString()}
                                </span>
                                <span className="text-purple-100/60 ml-2 text-xs sm:text-sm">Total Reads</span>
                            </div>
                        </div>
                    </div>

                    {/* Blog Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {blogs.map((blog) => (
                            <Card
                                key={blog._id}
                                className="bg-purple-900/20 border border-purple-500/30 p-0 overflow-hidden cursor-pointer h-full"
                                enableMagnetism={false}
                            >
                                {/* Cover Image */}
                                <div className="relative h-40 sm:h-48 overflow-hidden bg-black/20 group">
                                    <Image
                                        src={blog.coverImage}
                                        alt={blog.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                    {/* Tags */}
                                    <div className="absolute bottom-3 left-3 flex gap-2">
                                        {blog.tags.slice(0, 2).map((tag: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-purple-500/80 backdrop-blur-sm text-white text-xs font-medium rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 text-xs text-purple-100/60 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(blog.publishedAt || blog.createdAt || Date.now()).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {blog.readTime}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 hover:text-purple-300 transition-colors">
                                        {blog.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-purple-100/70 text-sm mb-4 line-clamp-3">
                                        {blog.excerpt}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-purple-400" />
                                            <span className="text-sm text-purple-100/80">{blog.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-purple-100/60">
                                            <Eye className="w-4 h-4" />
                                            <span className="text-sm">{(blog.views || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State (if no blogs) */}
                    {blogs.length === 0 && (
                        <div className="text-center py-20">
                            <BookOpen className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No blog posts yet</h3>
                            <p className="text-purple-100/60">Check back soon for new articles!</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
