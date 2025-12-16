'use client';

import { useEffect, useState, useRef } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ContentArea } from '@/components/ContentArea';
import { Card } from '@/components/Card';
import { gsap } from 'gsap';
import {
    Github, Linkedin, Facebook, MapPin, Mail, Phone, Calendar,
    Briefcase, GraduationCap, Award, Globe, Heart, Code
} from 'lucide-react';
import Image from 'next/image';
import { api } from '@/lib/api';

// Mock data for demonstration
const mockProfile = {
    name: "Asif Mahmud",
    title: "Full Stack Developer & UI/UX Enthusiast",
    tagline: "Building digital experiences that matter",
    avatar: "/profile.jpg",
    location: "Dhaka, Bangladesh",
    email: "asifmahmud053@gmail.com",
    phone: "+880 1234-567890",
    bio: "Passionate full-stack developer with 5+ years of experience in creating scalable web applications. I specialize in modern JavaScript frameworks and have a keen eye for design. I love turning complex problems into simple, beautiful, and intuitive solutions.",
    about: "I'm a dedicated software engineer who believes in writing clean, maintainable code and creating exceptional user experiences. My journey in tech started with a curiosity about how things work, and it has evolved into a career I'm truly passionate about.\n\nWhen I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community through blog posts and mentoring.",

    stats: {
        experience: "5+",
        projects: "50+",
        clients: "30+",
        awards: "10+"
    },

    education: [
        {
            degree: "Bachelor of Science in Computer Science",
            institution: "University of Dhaka",
            location: "Dhaka, Bangladesh",
            startDate: "2015",
            endDate: "2019",
            description: "Focused on software engineering, algorithms, and data structures. Graduated with honors.",
            gpa: "3.8/4.0"
        },
        {
            degree: "Higher Secondary Certificate (HSC)",
            institution: "Notre Dame College",
            location: "Dhaka, Bangladesh",
            startDate: "2013",
            endDate: "2015",
            description: "Science background with focus on Mathematics and Physics.",
            gpa: "5.0/5.0"
        }
    ],

    experience: [
        {
            position: "Senior Full Stack Developer",
            company: "Tech Solutions Ltd.",
            location: "Dhaka, Bangladesh",
            startDate: "Jan 2022",
            endDate: "Present",
            current: true,
            description: "Leading development of enterprise web applications using React, Node.js, and cloud technologies.",
            responsibilities: [
                "Architecting and developing scalable web applications",
                "Leading a team of 5 developers",
                "Implementing CI/CD pipelines and DevOps practices",
                "Mentoring junior developers and conducting code reviews"
            ]
        },
        {
            position: "Full Stack Developer",
            company: "Digital Agency Pro",
            location: "Dhaka, Bangladesh",
            startDate: "Jun 2020",
            endDate: "Dec 2021",
            current: false,
            description: "Developed custom web solutions for clients across various industries.",
            responsibilities: [
                "Built responsive web applications using React and Next.js",
                "Developed RESTful APIs with Node.js and Express",
                "Integrated third-party services and payment gateways",
                "Collaborated with designers to implement pixel-perfect UIs"
            ]
        },
        {
            position: "Junior Web Developer",
            company: "StartUp Hub",
            location: "Dhaka, Bangladesh",
            startDate: "Jul 2019",
            endDate: "May 2020",
            current: false,
            description: "Started my professional journey building web applications and learning industry best practices.",
            responsibilities: [
                "Developed frontend components using React",
                "Assisted in backend development with Node.js",
                "Fixed bugs and improved application performance",
                "Participated in agile development processes"
            ]
        }
    ],

    certifications: [
        {
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date: "2023",
            credentialId: "AWS-CSA-2023-12345"
        },
        {
            name: "MongoDB Certified Developer",
            issuer: "MongoDB University",
            date: "2022",
            credentialId: "MONGO-DEV-2022-67890"
        },
        {
            name: "React Advanced Patterns",
            issuer: "Frontend Masters",
            date: "2021",
            credentialId: "FM-REACT-2021-54321"
        }
    ],

    achievements: [
        {
            title: "Best Developer Award 2023",
            description: "Recognized for outstanding contribution to company projects and innovation",
            date: "2023"
        },
        {
            title: "Hackathon Winner",
            description: "Won first place in National Web Development Hackathon",
            date: "2022"
        },
        {
            title: "Open Source Contributor",
            description: "Active contributor to popular open-source projects with 500+ contributions",
            date: "2020-Present"
        }
    ],

    languages: [
        { name: "Bengali", proficiency: "Native" },
        { name: "English", proficiency: "Fluent" },
        { name: "Hindi", proficiency: "Intermediate" }
    ],

    interests: [
        "Open Source", "UI/UX Design", "Cloud Computing",
        "Mobile Development", "Photography", "Travel",
        "Reading Tech Blogs", "Mentoring"
    ],

    coreSkills: [
        { name: "React", level: 95 },
        { name: "Next.js", level: 90 },
        { name: "TypeScript", level: 88 },
        { name: "Node.js", level: 92 },
        { name: "MongoDB", level: 85 },
        { name: "PostgreSQL", level: 80 },
        { name: "Tailwind CSS", level: 93 },
        { name: "Git", level: 90 }
    ],

    socialLinks: [
        { platform: "github", url: "https://github.com/oficialasif" },
        { platform: "linkedin", url: "https://linkedin.com/in/oficialasif" },
        { platform: "facebook", url: "https://facebook.com/OficialAsif2" }
    ]
};

const AnimatedCounter = ({ value, label }: { value: string, label: string }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const numericValue = parseInt(value, 10);
    const suffix = value.replace(/[0-9]/g, '');

    useEffect(() => {
        const tracker = { count: 0 };
        gsap.to(tracker, {
            count: numericValue,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => setDisplayValue(Math.round(tracker.count))
        });
    }, [numericValue]);

    return (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center hover:bg-purple-500/20 transition-colors">
            <div className="text-3xl font-bold text-purple-300">
                {displayValue}{suffix}
            </div>
            <div className="text-sm text-purple-100/60">{label}</div>
        </div>
    );
};

const AnimatedSkillBar = ({ level }: { level: number }) => {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (barRef.current) {
                gsap.fromTo(barRef.current,
                    { width: "0%" },
                    { width: `${level}%`, duration: 1.5, ease: "power2.out" }
                );
            }
        }, 100); // Small delay to ensure render
        return () => clearTimeout(timer);
    }, [level]);

    return (
        <div className="w-full bg-purple-900/30 rounded-full h-2 overflow-hidden">
            <div
                ref={barRef}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                style={{ width: `${level}%` }}
            ></div>
        </div>
    );
};

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(mockProfile);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.profile.get();
            if (response.data.data.profile) {
                // Merge fetched data with mock data to ensure all fields exist if backend is partial
                setProfile({ ...mockProfile, ...response.data.data.profile });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Fallback to mock profile which is already set
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <ContentArea title="Profile" description="Loading..." enableMagnetism={false}>
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                </ContentArea>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-4 sm:space-y-8 p-3 sm:p-4 md:p-6 pt-16 lg:pt-6">
                {/* Profile Header */}
                <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8" enableMagnetism={false}>
                    <div className="flex flex-col gap-6 sm:gap-8 items-center">
                        {/* Profile Photo */}
                        <div className="relative">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-lg shadow-purple-500/30">
                                <Image
                                    src={profile.avatar}
                                    alt={profile.name}
                                    width={160}
                                    height={160}
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-[#0a0514]"></div>
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 text-center">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{profile.name}</h1>
                            <p className="text-lg sm:text-xl text-purple-300 mb-3">{profile.title}</p>
                            <p className="text-sm sm:text-base text-purple-100/70 italic mb-4">{profile.tagline}</p>

                            {/* Contact Info */}
                            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mb-4">
                                <div className="flex items-center gap-2 text-purple-100/80 justify-center">
                                    <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm">{profile.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-purple-100/80 justify-center">
                                    <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm break-all">{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-purple-100/80 justify-center">
                                    <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm">{profile.phone}</span>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex gap-3 justify-center">
                                {profile.socialLinks.map((link: any, index: number) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-all"
                                    >
                                        {link.platform === 'github' && <Github className="w-5 h-5 text-purple-300" />}
                                        {link.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-purple-300" />}
                                        {link.platform === 'facebook' && <Facebook className="w-5 h-5 text-purple-300" />}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full sm:w-auto">
                            <AnimatedCounter value={profile.stats.experience} label="Years Exp." />
                            <AnimatedCounter value={profile.stats.projects} label="Projects" />
                            <AnimatedCounter value={profile.stats.clients} label="Clients" />
                            <AnimatedCounter value={profile.stats.awards} label="Awards" />
                        </div>
                    </div>
                </Card>

                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
                        {/* About Me */}
                        <Card className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-4 sm:p-5 md:p-6" enableMagnetism={false}>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                                <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                                About Me
                            </h2>
                            <p className="text-sm sm:text-base text-purple-100/80 leading-relaxed mb-3 sm:mb-4">{profile.bio}</p>
                            <p className="text-sm sm:text-base text-purple-100/70 leading-relaxed whitespace-pre-line">{profile.about}</p>
                        </Card>

                        {/* Experience */}
                        <Card className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-4 sm:p-5 md:p-6" enableMagnetism={false}>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-purple-400" />
                                Work Experience
                            </h2>
                            <div className="space-y-6">
                                {profile.experience.map((exp: any, index: number) => (
                                    <div key={index} className="relative pl-8 pb-6 border-l-2 border-purple-500/30 last:border-l-0 last:pb-0">
                                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-500 border-4 border-[#0a0514]"></div>
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{exp.position}</h3>
                                                <p className="text-purple-300">{exp.company}</p>
                                                <p className="text-sm text-purple-100/60 flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {exp.location}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-purple-100/70">
                                                <Calendar className="w-4 h-4" />
                                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                            </div>
                                        </div>
                                        <p className="text-purple-100/70 mb-3">{exp.description}</p>
                                        <ul className="space-y-1">
                                            {exp.responsibilities.map((resp: string, idx: number) => (
                                                <li key={idx} className="text-sm text-purple-100/60 flex items-start gap-2">
                                                    <span className="text-purple-400 mt-1">•</span>
                                                    {resp}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Education */}
                        <Card className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-4 sm:p-5 md:p-6" enableMagnetism={false}>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                                <GraduationCap className="w-6 h-6 text-purple-400" />
                                Education
                            </h2>
                            <div className="space-y-6">
                                {profile.education.map((edu: any, index: number) => (
                                    <div key={index} className="relative pl-8 pb-6 border-l-2 border-purple-500/30 last:border-l-0 last:pb-0">
                                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-pink-500 border-4 border-[#0a0514]"></div>
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                                                <p className="text-purple-300">{edu.institution}</p>
                                                <p className="text-sm text-purple-100/60 flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {edu.location}
                                                </p>
                                            </div>
                                            <div className="text-sm text-purple-100/70">
                                                {edu.startDate} - {edu.endDate}
                                            </div>
                                        </div>
                                        <p className="text-purple-100/70 mb-2">{edu.description}</p>
                                        {edu.gpa && (
                                            <p className="text-sm text-purple-300">GPA: {edu.gpa}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 sm:space-y-6 md:space-y-8">
                        {/* Skills */}
                        <Card className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-4 sm:p-5 md:p-6" enableMagnetism={false}>
                            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                                <Code className="w-5 h-5 text-purple-400" />
                                Core Skills
                            </h2>
                            <div className="space-y-4">
                                {profile.coreSkills.map((skill: any, index: number) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-purple-100">{skill.name}</span>
                                            <span className="text-sm text-purple-300">{skill.level}%</span>
                                        </div>
                                        <AnimatedSkillBar level={skill.level} />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Certifications */}
                        <Card className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-4 sm:p-5 md:p-6" enableMagnetism={false}>
                            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-purple-400" />
                                Certifications
                            </h2>
                            <div className="space-y-4">
                                {profile.certifications.map((cert: any, index: number) => (
                                    <div key={index} className="border-l-2 border-purple-500/50 pl-4">
                                        <h3 className="text-sm font-semibold text-white">{cert.name}</h3>
                                        <p className="text-xs text-purple-300">{cert.issuer}</p>
                                        <p className="text-xs text-purple-100/60 mt-1">{cert.date}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Achievements */}
                        <Card className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-4 sm:p-5 md:p-6" enableMagnetism={false}>
                            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-purple-400" />
                                Achievements
                            </h2>
                            <div className="space-y-4">
                                {profile.achievements.map((achievement: any, index: number) => (
                                    <div key={index} className="border-l-2 border-pink-500/50 pl-4">
                                        <h3 className="text-sm font-semibold text-white">{achievement.title}</h3>
                                        <p className="text-xs text-purple-100/70 mt-1">{achievement.description}</p>
                                        <p className="text-xs text-purple-300 mt-1">{achievement.date}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Languages */}
                        <Card className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-4 sm:p-5 md:p-6" enableMagnetism={false}>
                            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-purple-400" />
                                Languages
                            </h2>
                            <div className="space-y-3">
                                {profile.languages.map((lang: any, index: number) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-purple-100">{lang.name}</span>
                                        <span className="text-sm text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">
                                            {lang.proficiency}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Interests */}
                        <Card className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-4 sm:p-5 md:p-6" enableMagnetism={false}>
                            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-purple-400" />
                                Interests
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {profile.interests.map((interest: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-100 hover:bg-purple-500/30 transition-all"
                                    >
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
