'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ContentArea } from '@/components/ContentArea';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Facebook, Twitter, Instagram, Youtube, Dribbble } from 'lucide-react';
import { api } from '@/lib/api';

export default function ContactPage() {
    const [contactInfo, setContactInfo] = useState({
        email: 'contact@asifmahmud.dev',
        phone: '+880 123 456 7890',
        location: 'Dhaka, Bangladesh',
        socialLinks: [] as any[]
    });

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const response = await api.profile.get();
                if (response.data.data.profile) {
                    const { email, phone, location, socialLinks } = response.data.data.profile;
                    setContactInfo({ email, phone, location, socialLinks: socialLinks || [] });
                }
            } catch (error) {
                console.error('Failed to fetch contact info', error);
            }
        };
        fetchContact();
    }, []);

    // Helper to get icon
    const getIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'github': return Github;
            case 'linkedin': return Linkedin;
            case 'facebook': return Facebook;
            case 'twitter': return Twitter;
            case 'instagram': return Instagram;
            case 'youtube': return Youtube;
            case 'dribbble': return Dribbble;
            default: return Github;
        }

    };

    return (
        <DashboardLayout>
            <ContentArea
                title="Contact"
                description="Let's connect and build something amazing together"
                enableMagnetism={false}
            >
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                                Get In Touch
                            </h2>
                            <p className="text-purple-100/70 leading-relaxed mb-6">
                                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                                Feel free to reach out through any of the channels below.
                            </p>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-purple-300 text-sm">Email</p>
                                    <p className="text-white font-medium">{contactInfo.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-purple-300 text-sm">Phone</p>
                                    <p className="text-white font-medium">{contactInfo.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-purple-300 text-sm">Location</p>
                                    <p className="text-white font-medium">{contactInfo.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Follow Me</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {contactInfo.socialLinks.map((link, idx) => {
                                    const Icon = getIcon(link.platform);
                                    return (
                                        <a
                                            key={idx}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 bg-purple-900/20 border border-purple-500/30 rounded-xl p-3 hover:border-purple-400/50 hover:bg-purple-900/30 transition-all duration-300"
                                        >
                                            <Icon className="w-5 h-5 text-purple-400" />
                                            <span className="text-purple-100 text-sm capitalize">{link.platform}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-purple-900/10 border border-purple-500/30 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-purple-200 text-sm mb-2">Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-purple-900/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:border-purple-400/50 focus:outline-none transition-all duration-300"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-purple-200 text-sm mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-purple-900/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:border-purple-400/50 focus:outline-none transition-all duration-300"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-purple-200 text-sm mb-2">Message</label>
                                <textarea
                                    rows={6}
                                    className="w-full bg-purple-900/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:border-purple-400/50 focus:outline-none transition-all duration-300 resize-none"
                                    placeholder="Your message..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl py-3 text-white font-semibold hover:shadow-[0_0_30px_rgba(137,42,220,0.5)] transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </ContentArea>
        </DashboardLayout>
    );
}
