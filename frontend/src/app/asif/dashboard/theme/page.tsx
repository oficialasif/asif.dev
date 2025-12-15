'use client';

import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Save, RotateCcw, Upload, Image as ImageIcon, Sparkles, Type, Palette as PaletteIcon, MousePointer2 } from 'lucide-react';
import Image from 'next/image';

const availableFonts = [
    { name: 'Default (Inter)', value: "'Inter', sans-serif" },
    { name: 'ByteBounce', value: "'ByteBounce', sans-serif" },
    { name: 'Daffiys', value: "'Daffiys', sans-serif" },
    { name: 'Early Quake', value: "'Early Quake', sans-serif" },
    { name: 'Higher Jump', value: "'Higher Jump', sans-serif" },
    { name: 'Kultum Ramadhan', value: "'Kultum Ramadhan', sans-serif" },
    { name: 'Medino', value: "'Medino', sans-serif" },
    { name: 'Orange Avenue', value: "'Orange Avenue', sans-serif" },
    { name: 'Primor Stylish', value: "'Primor Stylish', sans-serif" },
    { name: 'Rostex', value: "'Rostex', sans-serif" },
    { name: 'Rostex Outline', value: "'Rostex Outline', sans-serif" },
    { name: 'Sprintura', value: "'Sprintura', sans-serif" },
    { name: 'Thunky', value: "'Thunky', sans-serif" },
    { name: 'Zaslia', value: "'Zaslia', sans-serif" },
];

export default function ThemeCustomizationPage() {
    const [theme, setTheme] = useState<any>({
        colors: {},
        fonts: {},
        effects: {},
        gradients: {},
        enableAnimations: true,
        scrollAnimation: 'smooth',
        faviconUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchTheme();
    }, []);

    const fetchTheme = async () => {
        try {
            const response = await api.theme.get();
            const fetchedTheme = response.data.data.theme;
            setTheme(fetchedTheme);
        } catch (error) {
            console.error('Error fetching theme:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();

            // Flatten nested objects and append to FormData
            const appendNested = (obj: any, prefix = '') => {
                Object.keys(obj).forEach(key => {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        appendNested(obj[key], `${prefix}${key}.`);
                    } else {
                        formData.append(`${prefix}${key}`, obj[key]);
                    }
                });
            };

            // We need to handle this carefully. The backend flattened flattener expects specific structure.
            // Actually, for FormData, we can just send JSON string for complex objects if backend supports it,
            // or send individual fields.
            // My backend controller handles flattened structure like colors.primary.
            // So:
            if (theme.colors) appendNested(theme.colors, 'colors.');
            if (theme.fonts) appendNested(theme.fonts, 'fonts.');
            if (theme.effects) appendNested(theme.effects, 'effects.');
            if (theme.gradients) appendNested(theme.gradients, 'gradients.');

            formData.append('enableAnimations', String(theme.enableAnimations));
            formData.append('scrollAnimation', theme.scrollAnimation || 'smooth');

            if (faviconFile) {
                formData.append('favicon', faviconFile);
            }

            await api.theme.update(formData);
            toast.success('Theme updated successfully! Refresh to see changes.');
            fetchTheme();
            // Reset file input
            setFaviconFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update theme');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (!confirm('Are you sure you want to reset to default theme?')) return;

        try {
            await api.theme.reset();
            toast.success('Theme reset to default!');
            fetchTheme();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reset theme');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFaviconFile(file);
            // Create preview URL
            const url = URL.createObjectURL(file);
            setTheme({ ...theme, faviconUrl: url });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Theme Customization</h1>
                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                    >
                        <RotateCcw size={20} />
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-purple-500/30"
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* General Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Animation Settings */}
                <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Sparkles className="text-purple-400" />
                        Animation Settings
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Enable Globale Animations
                                </label>
                                <p className="text-xs text-gray-400">Toggle all website animations</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={theme.enableAnimations !== false}
                                    onChange={(e) => setTheme({ ...theme, enableAnimations: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                                <MousePointer2 className="w-4 h-4" />
                                Page Scroll Animation
                            </label>
                            <select
                                value={theme.scrollAnimation || 'smooth'}
                                onChange={(e) => setTheme({ ...theme, scrollAnimation: e.target.value })}
                                className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="default">Default (Instant)</option>
                                <option value="smooth">Smooth Scrolling</option>
                                <option value="bento">Bento Physics (Experimental)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Favicon Settings */}
                <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <ImageIcon className="text-purple-400" />
                        Website Favicon
                    </h2>
                    <div className="flex items-center gap-6">
                        <div className="relative w-20 h-20 bg-[#0a0a0f] rounded-xl border border-purple-500/30 flex items-center justify-center overflow-hidden">
                            {theme.faviconUrl ? (
                                <Image
                                    src={theme.faviconUrl}
                                    alt="Favicon"
                                    fill
                                    className="object-contain p-2"
                                />
                            ) : (
                                <span className="text-3xl">🌐</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="favicon-upload"
                            />
                            <label
                                htmlFor="favicon-upload"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg cursor-pointer transition-colors border border-purple-500/30"
                            >
                                <Upload size={16} />
                                Upload New Favicon
                            </label>
                            <p className="text-xs text-gray-500 mt-2">
                                Recommended: 32x32 or 64x64 PNG/ICO
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Typography */}
            <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Type className="text-purple-400" />
                    Typography & Fonts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Heading Font</label>
                        <select
                            value={theme.fonts?.heading || "'Inter', sans-serif"}
                            onChange={(e) => setTheme({
                                ...theme,
                                fonts: { ...theme.fonts, heading: e.target.value }
                            })}
                            className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {availableFonts.map(font => (
                                <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>{font.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Body Font</label>
                        <select
                            value={theme.fonts?.body || "'Inter', sans-serif"}
                            onChange={(e) => setTheme({
                                ...theme,
                                fonts: { ...theme.fonts, body: e.target.value }
                            })}
                            className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {availableFonts.map(font => (
                                <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>{font.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Code Font</label>
                        <select
                            value={theme.fonts?.code || "'Fira Code', monospace"}
                            onChange={(e) => setTheme({
                                ...theme,
                                fonts: { ...theme.fonts, code: e.target.value }
                            })}
                            className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {availableFonts.map(font => (
                                <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>{font.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Notice Font</label>
                        <select
                            value={theme.fonts?.notice || "'Inter', sans-serif"}
                            onChange={(e) => setTheme({
                                ...theme,
                                fonts: { ...theme.fonts, notice: e.target.value }
                            })}
                            className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {availableFonts.map(font => (
                                <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>{font.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Colors */}
            <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <PaletteIcon className="text-purple-400" />
                    Color Palette (Advanced)
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {Object.keys(theme.colors || {}).map((key) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={theme.colors[key] || '#000000'}
                                    onChange={(e) =>
                                        setTheme({
                                            ...theme,
                                            colors: { ...theme.colors, [key]: e.target.value },
                                        })
                                    }
                                    className="w-12 h-10 rounded cursor-pointer bg-transparent border-0"
                                />
                                <input
                                    type="text"
                                    value={theme.colors[key] || ''}
                                    onChange={(e) =>
                                        setTheme({
                                            ...theme,
                                            colors: { ...theme.colors, [key]: e.target.value },
                                        })
                                    }
                                    className="flex-1 px-3 py-2 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                    ))}
                    {Object.keys(theme.colors || {}).length === 0 && (
                        <p className="text-gray-500 col-span-3">Loading default colors...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
