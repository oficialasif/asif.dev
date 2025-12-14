'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Trash2, Save, X } from 'lucide-react';

export default function InterestsManagementPage() {
    const [interests, setInterests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', icon: '', description: '', order: 0 });

    useEffect(() => {
        fetchInterests();
    }, []);

    const fetchInterests = async () => {
        try {
            const response = await api.interests.getAll();
            setInterests(response.data.data.interests || []);
        } catch (error) {
            console.error('Error fetching interests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.interests.create(formData);
            toast.success('Interest added successfully!');
            setShowForm(false);
            setFormData({ name: '', icon: '', description: '', order: 0 });
            fetchInterests();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add interest');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.interests.delete(id);
            toast.success('Interest deleted!');
            fetchInterests();
        } catch (error: any) {
            toast.error('Failed to delete interest');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Interests Management</h1>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/30">
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'Cancel' : 'Add Interest'}
                </button>
            </div>

            {showForm && (
                <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white" required />
                        <input type="text" placeholder="Icon (emoji or lucide name)" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white" required />
                        <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="col-span-2 px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white" rows={3} />
                        <button type="submit" className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"><Save size={20} />Save</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {interests.map((interest) => (
                    <div key={interest._id} className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-4 text-center relative group">
                        <div className="text-4xl mb-2">{interest.icon}</div>
                        <h3 className="text-white font-semibold">{interest.name}</h3>
                        <button onClick={() => handleDelete(interest._id)} className="absolute top-2 right-2 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
}
