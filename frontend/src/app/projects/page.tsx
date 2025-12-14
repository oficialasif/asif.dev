'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ExternalLink, Github, Facebook, Eye, Code2, Calendar } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/Card';
import { motion, AnimatePresence } from 'framer-motion';

import { api } from '@/lib/api';

// Tech stack icons mapping
const techIcons: { [key: string]: string } = {
    'React': '⚛️',
    'Next.js': '▲',
    'TypeScript': 'TS',
    'Node.js': '🟢',
    'MongoDB': '🍃',
    'Tailwind': '🎨',
    'Express': '🚂',
    'PostgreSQL': '🐘',
    'Python': '🐍',
    'Django': '🎸',
    'Vue.js': '💚',
    'Angular': '🅰️',
};

interface Project {
    _id: string;
    title: string;
    description: string;
    images: string[];
    technologies: string[];
    category: string;
    liveUrl?: string;
    githubUrl?: string;
    views?: number;
    createdAt?: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
    const [direction, setDirection] = useState<{ [key: string]: number }>({}); // 1 for next, -1 for prev
    const [showPill, setShowPill] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.projects.getAll();
                setProjects(response.data.data.projects || []);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Handle scroll to show/hide pill
    useEffect(() => {
        const handleScroll = () => {

            if (containerRef.current) {
                const scrollTop = containerRef.current.scrollTop;
                // Show pill when scrolled past header (approx 200px)
                setShowPill(scrollTop > 200);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    // Auto-scroll images
    const handleImageScroll = (projectId: string, dir: 'next' | 'prev', totalImages: number) => {
        const newDirection = dir === 'next' ? 1 : -1;
        setDirection(prev => ({ ...prev, [projectId]: newDirection }));

        setCurrentImageIndex(prev => {
            const current = prev[projectId] || 0;
            let newIndex;
            if (dir === 'next') {
                newIndex = (current + 1) % totalImages;
            } else {
                newIndex = current === 0 ? totalImages - 1 : current - 1;
            }
            return { ...prev, [projectId]: newIndex };
        });
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };

    const totalViews = projects.reduce((sum: number, p: Project) => sum + (p.views || 0), 0);

    return (
        <DashboardLayout>
            {/* Sticky Pill Header */}
            <div
                className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${showPill
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-10 pointer-events-none'
                    }`}
            >
                <div className="bg-purple-900/80 backdrop-blur-xl border border-purple-500/30 rounded-full px-8 py-3 shadow-2xl shadow-purple-500/20">
                    <div className="flex items-center gap-6 text-sm">
                        <span className="text-white font-semibold">My Projects</span>
                        <div className="w-px h-4 bg-purple-500/30"></div>
                        <span className="text-purple-100/80">
                            <span className="font-semibold text-purple-300">{projects.length}</span> Projects
                        </span>
                        <div className="w-px h-4 bg-purple-500/30"></div>
                        <span className="text-purple-100/80 flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="font-semibold text-purple-300">{totalViews.toLocaleString()}</span> Views
                        </span>
                    </div>
                </div>
            </div>

            {/* Scroll Container (Standard Scroll) */}
            <div
                ref={containerRef}
                className="h-screen overflow-y-auto"
                style={{ scrollbarWidth: 'thin' }}
            >
                <div className="space-y-8 p-6">
                    {/* Header Section (Matching Blog Header) */}
                    <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-2xl p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="p-4 bg-purple-500/20 rounded-2xl border border-purple-500/30 flex-shrink-0">
                                <Code2 className="w-12 h-12 text-purple-400" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-4xl font-bold text-white mb-2">My Projects</h1>
                                <p className="text-xl text-purple-100/70 max-w-2xl">
                                    Showcasing a collection of my latest work, personal projects, and technical experiments.
                                    Each project represents a unique challenge and solution.
                                </p>

                                <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                                    <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                        <span className="text-purple-100 font-semibold">{projects.length}</span>
                                        <span className="text-purple-100/60 ml-2">Total Projects</span>
                                    </div>
                                    <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                        <span className="text-purple-100 font-semibold">{totalViews.toLocaleString()}</span>
                                        <span className="text-purple-100/60 ml-2">Total Views</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project List */}
                    <div className="space-y-12">
                        {projects.map((project, projectIndex) => {
                            const currentImg = currentImageIndex[project._id] || 0;
                            const projectDirection = direction[project._id] || 0;

                            return (
                                <Card
                                    key={project._id}
                                    className="bg-purple-900/20 border border-purple-500/30 overflow-hidden"
                                    enableMagnetism={false}
                                >
                                    <div className="grid lg:grid-cols-2 gap-0">
                                        {/* Image Carousel */}
                                        <div className="relative h-[400px] lg:h-auto overflow-hidden bg-black/20 group">
                                            <AnimatePresence initial={false} custom={projectDirection}>
                                                <motion.div
                                                    key={project._id + "-" + currentImg}
                                                    custom={projectDirection}
                                                    variants={variants}
                                                    initial="enter"
                                                    animate="center"
                                                    exit="exit"
                                                    transition={{
                                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                                        opacity: { duration: 0.2 }
                                                    }}
                                                    className="absolute inset-0 w-full h-full"
                                                >
                                                    <Image
                                                        src={project.images[currentImg]}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover"
                                                        priority={projectIndex < 2 && currentImg === 0}
                                                    />
                                                </motion.div>
                                            </AnimatePresence>

                                            {/* Image Navigation */}
                                            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <button
                                                    onClick={() => handleImageScroll(project._id, 'prev', project.images.length)}
                                                    className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                                >
                                                    ←
                                                </button>
                                                <button
                                                    onClick={() => handleImageScroll(project._id, 'next', project.images.length)}
                                                    className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                                >
                                                    →
                                                </button>
                                            </div>

                                            {/* Image Indicators */}
                                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                                                {(project.images || []).map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === currentImg
                                                            ? 'w-8 bg-purple-400'
                                                            : 'w-1.5 bg-white/30 hover:bg-white/50'
                                                            }`}
                                                        onClick={() => {
                                                            const newDirection = idx > currentImg ? 1 : -1;
                                                            setDirection(prev => ({ ...prev, [project._id]: newDirection }));
                                                            setCurrentImageIndex(prev => ({ ...prev, [project._id]: idx }));
                                                        }}
                                                    />
                                                ))}
                                            </div>

                                            {/* Category Badge */}
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="px-3 py-1 bg-purple-500/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                                    {project.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Project Details */}
                                        <div className="p-8 flex flex-col justify-between">
                                            <div>
                                                {/* Title and Date */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <h2 className="text-2xl font-bold text-white">{project.title}</h2>
                                                    <div className="flex items-center gap-1 text-purple-100/60 text-sm">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(project.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <p className="text-purple-100/70 leading-relaxed mb-6">
                                                    {project.description}
                                                </p>

                                                {/* Tech Stack */}
                                                <div className="mb-6">
                                                    <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                                                        <Code2 className="w-4 h-4" />
                                                        Tech Stack
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(project.technologies || []).map((tech: string, idx: number) => (
                                                            <div
                                                                key={idx}
                                                                className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-100 text-sm font-medium flex items-center gap-2 hover:bg-purple-500/30 transition-all"
                                                            >
                                                                <span>{techIcons[tech] || '💻'}</span>
                                                                {tech}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer: Links and Views */}
                                            <div className="flex items-center justify-between pt-6 border-t border-purple-500/20">
                                                {/* Links */}
                                                <div className="flex gap-3">
                                                    {project.liveUrl && (
                                                        <a
                                                            href={project.liveUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all shadow-lg shadow-purple-500/30 text-sm"
                                                            title="View Live"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                            <span className="font-medium">Live Demo</span>
                                                        </a>
                                                    )}
                                                    {project.githubUrl && (
                                                        <a
                                                            href={project.githubUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-100 rounded-lg transition-all text-sm"
                                                            title="View on GitHub"
                                                        >
                                                            <Github className="w-4 h-4" />
                                                            <span className="font-medium">Code</span>
                                                        </a>
                                                    )}
                                                </div>

                                                {/* View Counter */}
                                                <div className="flex items-center gap-2 text-purple-100/60">
                                                    <Eye className="w-4 h-4" />
                                                    <span className="font-medium">
                                                        {(project.views || 0).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
