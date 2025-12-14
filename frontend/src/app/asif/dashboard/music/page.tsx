'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

export default function MusicManagementPage() {
    const [music, setMusic] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', artist: '', album: '', spotifyUrl: '', order: 0 });

    useEffect(() => {
        fetchMusic();
    }, []);

    const fetchMusic = async () => {
        try {
            const response = await api.music.getAll();
            setMusic(response.data.data.music || []);
        } catch (error) {
            console.error('Error fetching music:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.music.create(formData);
            toast.success('Music added successfully!');
            setShowForm(false);
            setFormData({ title: '', artist: '', album: '', spotifyUrl: '', order: 0 });
            fetchMusic();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add music');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.music.delete(id);
            toast.success('Music deleted!');
            fetchMusic();
        } catch (error: any) {
            toast.error('Failed to delete music');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Music Management</h1>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/30">
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'Cancel' : 'Add Music'}
                </button>
            </div>

            {showForm && (
                <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white" />
                        <input type="text" placeholder="Artist" value={formData.artist} onChange={(e) => setFormData({ ...formData, artist: e.target.value })} className="px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white" />
                        <input type="text" placeholder="Album" value={formData.album} onChange={(e) => setFormData({ ...formData, album: e.target.value })} className="px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white" />
                        <input type="text" placeholder="Spotify URL" value={formData.spotifyUrl} onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })} className="px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white" />
                        <button type="submit" className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"><Save size={20} />Save</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {music.map((track) => (
                    <div key={track._id} className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-semibold">{track.title}</h3>
                            <p className="text-gray-400 text-sm">{track.artist}</p>
                        </div>
                        <button onClick={() => handleDelete(track._id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
}
