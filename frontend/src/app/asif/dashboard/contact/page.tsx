'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Save, Plus, Trash2, Github, Linkedin, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Card } from '@/components/Card';

export default function ContactManagementPage() {
    const [profile, setProfile] = useState<any>({
        email: '',
        phone: '',
        location: '',
        socialLinks: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.profile.get();
            const data = response.data.data.profile || {};
            setProfile({
                ...data,
                socialLinks: data.socialLinks || []
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load contact info');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLinkChange = (index: number, field: string, value: string) => {
        const newLinks = [...profile.socialLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setProfile({ ...profile, socialLinks: newLinks });
    };

    const addSocialLink = () => {
        setProfile({
            ...profile,
            socialLinks: [...profile.socialLinks, { platform: 'github', url: '' }]
        });
    };

    const removeSocialLink = (index: number) => {
        const newLinks = profile.socialLinks.filter((_: any, i: number) => i !== index);
        setProfile({ ...profile, socialLinks: newLinks });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const formData = new FormData();
            formData.append('email', profile.email);
            formData.append('phone', profile.phone);
            formData.append('location', profile.location);
            formData.append('socialLinks', JSON.stringify(profile.socialLinks));

            await api.profile.update(formData);
            toast.success('Contact info updated successfully!');
            fetchProfile();
        } catch (error: any) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update contact info');
        } finally {
            setSaving(false);
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
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Contact Management</h1>
                    <p className="text-purple-200/60 mt-2">Manage your contact details and social media links</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Mail className="w-5 h-5 text-purple-400" />
                        Contact Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="contact@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={profile.location}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Github className="w-5 h-5 text-purple-400" />
                            Social Links
                        </h2>
                        <button
                            type="button"
                            onClick={addSocialLink}
                            className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Plus size={16} />
                            Add Link
                        </button>
                    </div>

                    <div className="space-y-4">
                        {profile.socialLinks.map((link: any, index: number) => (
                            <div key={index} className="flex gap-4 items-start">
                                <div className="w-1/3">
                                    <select
                                        value={link.platform}
                                        onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                                        className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="github">GitHub</option>
                                        <option value="linkedin">LinkedIn</option>
                                        <option value="facebook">Facebook</option>
                                        <option value="twitter">Twitter</option>
                                        <option value="instagram">Instagram</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="dribbble">Dribbble</option>
                                        <option value="behance">Behance</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="url"
                                        value={link.url}
                                        onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                                        className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="https://..."
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeSocialLink(index)}
                                    className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}

                        {profile.socialLinks.length === 0 && (
                            <div className="text-center py-8 text-gray-500 italic">
                                No social links added yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Action */}
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full shadow-lg shadow-purple-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <Save size={24} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
