'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.settings.get();
            setSettings(response.data.data.settings || {});
        } catch (error) {
            console.error('Error fetching settings:', error);
            setSettings({});
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.settings.update(settings);
            toast.success('Settings updated successfully!');
            fetchSettings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
    }

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Site Settings</h1>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-purple-500/30">
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">General Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Site Title</label>
                        <input type="text" value={settings?.siteTitle || ''} onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })} className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Site URL</label>
                        <input type="url" value={settings?.siteUrl || ''} onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })} className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
                        <textarea value={settings?.siteDescription || ''} onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })} rows={3} className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="maintenance" checked={settings?.maintenanceMode || false} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} className="w-5 h-5 rounded" />
                        <label htmlFor="maintenance" className="text-sm font-medium text-gray-300">Maintenance Mode</label>
                    </div>
                </div>
            </div>

            <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Loading Animation</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Animation Type</label>
                        <select value={settings?.loadingAnimation?.type || 'spinner'} onChange={(e) => setSettings({ ...settings, loadingAnimation: { ...settings.loadingAnimation, type: e.target.value } })} className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="spinner">Spinner</option>
                            <option value="dots">Dots</option>
                            <option value="pulse">Pulse</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Animation Color</label>
                        <input type="color" value={settings?.loadingAnimation?.color || '#8b5cf6'} onChange={(e) => setSettings({ ...settings, loadingAnimation: { ...settings.loadingAnimation, color: e.target.value } })} className="w-20 h-10 rounded cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
}
