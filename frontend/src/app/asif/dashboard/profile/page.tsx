'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
    Save, Plus, Trash2, User, Briefcase, GraduationCap,
    Code, Award, FileText, Image as ImageIcon, Globe,
    Scroll, Trophy, Languages
} from 'lucide-react';
import Image from 'next/image';

export default function ProfileManagementPage() {
    const [profile, setProfile] = useState<any>({
        name: '', title: '', tagline: '', bio: '', about: '',
        stats: { experience: '', projects: '', clients: '', awards: '' },
        coreSkills: [],
        interests: [],
        languages: [],
        experience: [],
        education: [],
        certifications: [],
        achievements: []
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.profile.get();
            const data = response.data.data.profile || {};

            // Ensure array fields are initialized
            setProfile({
                ...data,
                stats: data.stats || { experience: '0', projects: '0', clients: '0', awards: '0' },
                coreSkills: data.coreSkills || [],
                interests: data.interests || [],
                languages: data.languages || [],
                experience: data.experience || [],
                education: data.education || [],
                certifications: data.certifications || [],
                achievements: data.achievements || []
            });

            if (data.avatar) setAvatarPreview(data.avatar);
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const addItem = (field: string, initialValue: any) => {
        setProfile({ ...profile, [field]: [...profile[field], initialValue] });
    };

    const removeItem = (field: string, index: number) => {
        setProfile({ ...profile, [field]: profile[field].filter((_: any, i: number) => i !== index) });
    };

    const updateItem = (field: string, index: number, subField: string, value: any) => {
        const newArray = [...profile[field]];
        if (subField) {
            newArray[index] = { ...newArray[index], [subField]: value };
        } else {
            // For simple arrays like interests
            newArray[index] = value;
        }
        setProfile({ ...profile, [field]: newArray });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const formData = new FormData();

            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            ['name', 'title', 'tagline', 'bio', 'about'].forEach(key => {
                formData.append(key, profile[key] || '');
            });

            ['stats', 'coreSkills', 'interests', 'languages', 'experience', 'education', 'certifications', 'achievements'].forEach(key => {
                formData.append(key, JSON.stringify(profile[key]));
            });

            await api.profile.update(formData);
            toast.success('Profile updated successfully!');
            fetchProfile();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
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

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: User },
        { id: 'resume', label: 'Resume', icon: FileText },
        { id: 'skills', label: 'Skills & Interests', icon: Code },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
                    <p className="text-purple-200/60 mt-1">Update your personal information and resume</p>
                </div>

                <div className="flex bg-[#1e1e30] p-1 rounded-xl border border-purple-500/20">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'text-purple-300 hover:text-white hover:bg-purple-500/10'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-24">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                    <div className="space-y-6">
                        {/* Avatar Section */}
                        <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-purple-400" />
                                Profile Photo
                            </h2>
                            <div className="flex items-center gap-6">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/30 bg-black/40">
                                    {avatarPreview ? (
                                        <Image src={avatarPreview} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-purple-500/50">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="cursor-pointer px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors inline-block">
                                        Upload New Photo
                                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                    </label>
                                    <p className="text-xs text-gray-400 mt-2">Recommended: 400x400px, Max 2MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Basic Details */}
                        <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6">Personal Details</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                    <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Professional Title</label>
                                    <input type="text" value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Tagline (One-liner)</label>
                                    <input type="text" value={profile.tagline} onChange={(e) => setProfile({ ...profile, tagline: e.target.value })} className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Short Bio</label>
                                    <textarea rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Detailed About Me</label>
                                    <textarea rows={6} value={profile.about} onChange={(e) => setProfile({ ...profile, about: e.target.value })} className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500" />
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6">Stats Counters</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {['experience', 'projects', 'clients', 'awards'].map(key => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">{key}</label>
                                        <input type="text" value={profile.stats[key]} onChange={(e) => setProfile({ ...profile, stats: { ...profile.stats, [key]: e.target.value } })} className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Resume Tab */}
                {activeTab === 'resume' && (
                    <div className="space-y-6">
                        {/* Experience */}
                        <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Briefcase className="w-5 h-5 text-purple-400" /> Work Experience</h2>
                                <button type="button" onClick={() => addItem('experience', { position: '', company: '', location: '', startDate: '', endDate: '', description: '', responsibilities: [] })} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg text-sm"><Plus size={16} /> Add Job</button>
                            </div>
                            <div className="space-y-6">
                                {profile.experience.map((exp: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-[#0a0a0f] border border-purple-500/30 rounded-xl space-y-4 relative">
                                        <button type="button" onClick={() => removeItem('experience', idx)} className="absolute top-4 right-4 text-red-400 hover:bg-red-500/10 p-2 rounded-lg"><Trash2 size={16} /></button>
                                        <div className="grid md:grid-cols-2 gap-4 pr-10">
                                            <input type="text" placeholder="Position" value={exp.position} onChange={(e) => updateItem('experience', idx, 'position', e.target.value)} className="w-full px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                            <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateItem('experience', idx, 'company', e.target.value)} className="w-full px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                                <input type="text" placeholder="Location" value={exp.location} onChange={(e) => updateItem('experience', idx, 'location', e.target.value)} className="w-full pl-9 px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                            </div>
                                            <div className="flex gap-2">
                                                <input type="text" placeholder="Start Date" value={exp.startDate} onChange={(e) => updateItem('experience', idx, 'startDate', e.target.value)} className="w-1/2 px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                                <input type="text" placeholder="End Date" value={exp.endDate} onChange={(e) => updateItem('experience', idx, 'endDate', e.target.value)} className="w-1/2 px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <textarea placeholder="Description" value={exp.description} onChange={(e) => updateItem('experience', idx, 'description', e.target.value)} className="w-full px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" rows={2} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education */}
                        <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><GraduationCap className="w-5 h-5 text-purple-400" /> Education</h2>
                                <button type="button" onClick={() => addItem('education', { degree: '', institution: '', location: '', startDate: '', endDate: '', description: '' })} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg text-sm"><Plus size={16} /> Add Education</button>
                            </div>
                            <div className="space-y-6">
                                {profile.education.map((edu: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-[#0a0a0f] border border-purple-500/30 rounded-xl space-y-4 relative">
                                        <button type="button" onClick={() => removeItem('education', idx)} className="absolute top-4 right-4 text-red-400 hover:bg-red-500/10 p-2 rounded-lg"><Trash2 size={16} /></button>
                                        <div className="grid md:grid-cols-2 gap-4 pr-10">
                                            <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateItem('education', idx, 'degree', e.target.value)} className="w-full px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                            <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => updateItem('education', idx, 'institution', e.target.value)} className="w-full px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                                <input type="text" placeholder="Location" value={edu.location} onChange={(e) => updateItem('education', idx, 'location', e.target.value)} className="w-full pl-9 px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                            </div>
                                            <div className="flex gap-2">
                                                <input type="text" placeholder="Start Date" value={edu.startDate} onChange={(e) => updateItem('education', idx, 'startDate', e.target.value)} className="w-1/2 px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                                <input type="text" placeholder="End Date" value={edu.endDate} onChange={(e) => updateItem('education', idx, 'endDate', e.target.value)} className="w-1/2 px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <textarea placeholder="Description" value={edu.description} onChange={(e) => updateItem('education', idx, 'description', e.target.value)} className="w-full px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" rows={2} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Scroll className="w-5 h-5 text-purple-400" /> Certifications</h2>
                                <button type="button" onClick={() => addItem('certifications', { name: '', issuer: '', date: '', credentialId: '' })} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg text-sm"><Plus size={16} /> Add Certification</button>
                            </div>
                            <div className="space-y-4">
                                {profile.certifications.map((cert: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-[#0a0a0f] border border-purple-500/30 rounded-xl space-y-4 relative">
                                        <button type="button" onClick={() => removeItem('certifications', idx)} className="absolute top-4 right-4 text-red-400 hover:bg-red-500/10 p-2 rounded-lg"><Trash2 size={16} /></button>
                                        <div className="grid md:grid-cols-2 gap-4 pr-10">
                                            <input type="text" placeholder="Certification Name" value={cert.name} onChange={(e) => updateItem('certifications', idx, 'name', e.target.value)} className="w-full px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                            <input type="text" placeholder="Issuer" value={cert.issuer} onChange={(e) => updateItem('certifications', idx, 'issuer', e.target.value)} className="w-full px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                            <input type="text" placeholder="Date" value={cert.date} onChange={(e) => updateItem('certifications', idx, 'date', e.target.value)} className="w-full px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                            <input type="text" placeholder="Credential ID (Optional)" value={cert.credentialId} onChange={(e) => updateItem('certifications', idx, 'credentialId', e.target.value)} className="w-full px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Trophy className="w-5 h-5 text-purple-400" /> Achievements</h2>
                                <button type="button" onClick={() => addItem('achievements', { title: '', description: '', date: '' })} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg text-sm"><Plus size={16} /> Add Achievement</button>
                            </div>
                            <div className="space-y-4">
                                {profile.achievements.map((ach: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-[#0a0a0f] border border-purple-500/30 rounded-xl space-y-4 relative">
                                        <button type="button" onClick={() => removeItem('achievements', idx)} className="absolute top-4 right-4 text-red-400 hover:bg-red-500/10 p-2 rounded-lg"><Trash2 size={16} /></button>
                                        <div className="grid md:grid-cols-2 gap-4 pr-10">
                                            <input type="text" placeholder="Title" value={ach.title} onChange={(e) => updateItem('achievements', idx, 'title', e.target.value)} className="w-full px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                            <input type="text" placeholder="Date" value={ach.date} onChange={(e) => updateItem('achievements', idx, 'date', e.target.value)} className="w-full px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" />
                                            <div className="md:col-span-2">
                                                <textarea placeholder="Description" value={ach.description} onChange={(e) => updateItem('achievements', idx, 'description', e.target.value)} className="w-full px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white" rows={2} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Skills & Interests Tab */}
                {activeTab === 'skills' && (
                    <div className="space-y-6">
                        {/* Core Skills */}
                        <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Code className="w-5 h-5 text-purple-400" /> Core Skills</h2>
                                <button type="button" onClick={() => addItem('coreSkills', { name: '', level: 50 })} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg text-sm"><Plus size={16} /> Add Skill</button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {profile.coreSkills.map((skill: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 p-3 bg-[#0a0a0f] border border-purple-500/30 rounded-xl items-center">
                                        <input type="text" placeholder="Skill Name" value={skill.name} onChange={(e) => updateItem('coreSkills', idx, 'name', e.target.value)} className="flex-1 px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white text-sm" />
                                        <div className="w-24 flex items-center gap-2">
                                            <input type="number" min="0" max="100" value={skill.level} onChange={(e) => updateItem('coreSkills', idx, 'level', parseInt(e.target.value))} className="w-full px-2 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white text-sm text-center" />
                                            <span className="text-gray-400 text-xs">%</span>
                                        </div>
                                        <button type="button" onClick={() => removeItem('coreSkills', idx)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Languages className="w-5 h-5 text-purple-400" /> Languages</h2>
                                <button type="button" onClick={() => addItem('languages', { name: '', proficiency: 'Fluent' })} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg text-sm"><Plus size={16} /> Add Language</button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {profile.languages.map((lang: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 p-3 bg-[#0a0a0f] border border-purple-500/30 rounded-xl items-center">
                                        <input type="text" placeholder="Language" value={lang.name} onChange={(e) => updateItem('languages', idx, 'name', e.target.value)} className="flex-1 px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white text-sm" />
                                        <select
                                            value={lang.proficiency}
                                            onChange={(e) => updateItem('languages', idx, 'proficiency', e.target.value)}
                                            className="px-3 py-2 bg-[#1e1e30] border border-purple-500/30 rounded-lg text-white text-sm outline-none"
                                        >
                                            <option value="Native">Native</option>
                                            <option value="Fluent">Fluent</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Basic">Basic</option>
                                        </select>
                                        <button type="button" onClick={() => removeItem('languages', idx)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="bg-[#1e1e30] border border-purple-500/20 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Award className="w-5 h-5 text-purple-400" /> Interests</h2>
                                <button type="button" onClick={() => addItem('interests', '')} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg text-sm"><Plus size={16} /> Add Interest</button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {profile.interests.map((interest: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0f] border border-purple-500/30 rounded-full">
                                        <input
                                            type="text"
                                            value={interest}
                                            onChange={(e) => updateItem('interests', idx, '', e.target.value)}
                                            className="bg-transparent text-white text-sm outline-none w-32"
                                            placeholder="Interest"
                                        />
                                        <button type="button" onClick={() => removeItem('interests', idx)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Float */}
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
