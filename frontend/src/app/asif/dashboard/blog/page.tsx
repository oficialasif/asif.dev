'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import dynamic from 'next/dynamic';

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-[300px] bg-[#0a0a0f] border border-purple-500/30 rounded-lg animate-pulse" />
});


export default function BlogManagementPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        coverImage: '',
        tags: '',
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await api.blog.getAll();
            setBlogs(response.data.data || []);
        } catch (error) {
            toast.error('Failed to fetch blogs');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const tagsArray = formData.tags.split(',').map(tag => tag.trim());
            await api.blog.create({ ...formData, tags: tagsArray });
            toast.success('Blog post created successfully!');
            setFormData({ title: '', excerpt: '', content: '', coverImage: '', tags: '' });
            fetchBlogs();
        } catch (error) {
            toast.error('Failed to create blog post');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;
        try {
            await api.blog.delete(id);
            toast.success('Blog post deleted successfully!');
            fetchBlogs();
        } catch (error) {
            toast.error('Failed to delete blog post');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-purple-400" />
                    <h1 className="text-2xl font-bold text-white">Blog Management</h1>
                </div>
            </div>

            {/* Add New Blog Form */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Blog Post
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-purple-100 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                            placeholder="Enter blog title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-purple-100 mb-2">
                            Excerpt
                        </label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                            placeholder="Brief description"
                            rows={2}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-purple-100 mb-2">
                            Content (with Highlights!)
                        </label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(html) => setFormData({ ...formData, content: html })}
                            placeholder="Write your blog post content..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-purple-100 mb-2">
                            Cover Image URL
                        </label>
                        <input
                            type="url"
                            value={formData.coverImage}
                            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                            className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-purple-100 mb-2">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                            placeholder="React, TypeScript, Web Development"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-purple-500/30"
                    >
                        Publish Blog Post
                    </button>
                </form>
            </div>

            {/* Blog Posts List */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Published Posts</h2>
                {blogs.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-purple-400/50 mx-auto mb-3" />
                        <p className="text-gray-400">No blog posts yet. Create your first one above!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {blogs.map((blog) => (
                            <div
                                key={blog.id}
                                className="flex items-center justify-between p-4 bg-[#0a0a0f] border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all"
                            >
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">{blog.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{blog.excerpt}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
