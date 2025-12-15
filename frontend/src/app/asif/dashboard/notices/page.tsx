'use client';

import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import dynamic from 'next/dynamic';

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-[200px] bg-[#0a0a0f] border border-purple-500/30 rounded-lg animate-pulse" />
});

export default function NoticeManagementPage() {
    const [notices, setNotices] = useState<any[]>([]);
    const [formData, setFormData] = useState({ text: '' });

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await api.notices.getAll();
            setNotices(response.data.data || []);
        } catch (error) {
            toast.error('Failed to fetch notices');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.text.trim()) {
            toast.error('Please enter a notice');
            return;
        }

        try {
            await api.notices.create({ text: formData.text, contentType: 'html' });
            toast.success('Notice added successfully!');
            setFormData({ text: '' });
            fetchNotices();
        } catch (error) {
            toast.error('Failed to add notice');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this notice?')) return;
        try {
            await api.notices.delete(id);
            toast.success('Notice deleted successfully!');
            fetchNotices();
        } catch (error) {
            toast.error('Failed to delete notice');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Bell className="w-8 h-8 text-purple-400" />
                    <h1 className="text-2xl font-bold text-white">Notice Management</h1>
                </div>
            </div>

            {/* Add New Notice Form */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add New Notice
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-purple-100 mb-2">
                            Notice Content (with Highlights!)
                        </label>
                        <RichTextEditor
                            content={formData.text}
                            onChange={(html) => setFormData({ text: html })}
                            placeholder="Enter announcement text..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-purple-500/30"
                    >
                        Add Notice
                    </button>
                </form>
            </div>

            {/* Notices List */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                    Active Notices ({notices.length})
                </h2>
                <div className="space-y-3">
                    {notices.map((notice) => (
                        <div
                            key={notice._id}
                            className="flex items-center justify-between p-4 bg-[#0a0a0f] border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all"
                        >
                            <p className="text-purple-100/90 flex-1">{notice.text}</p>
                            <button
                                onClick={() => handleDelete(notice._id)}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all ml-4"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {notices.length === 0 && (
                    <div className="text-center py-12">
                        <Bell className="w-12 h-12 text-purple-400/50 mx-auto mb-3" />
                        <p className="text-gray-400">No notices yet. Add your first announcement above!</p>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-100/80 text-sm">
                    <strong>💡 Tip:</strong> Use the toolbar to highlight important text,  add circles, underlines, and more! Notices will auto-scroll on the homepage.
                </p>
            </div>
        </div>
    );
}
