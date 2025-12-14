'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, ExternalLink, Github, X } from 'lucide-react';

export default function ProjectsManagementPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<any | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        category: 'Web',
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.projects.getAll();
            setProjects(response.data.data.projects || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setSelectedFiles(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('githubUrl', formData.githubUrl);
        data.append('liveUrl', formData.liveUrl);
        data.append('category', formData.category);

        // Handle technologies (split by comma)
        const techArray = formData.technologies.split(',').map(t => t.trim()).filter(Boolean);
        techArray.forEach(tech => data.append('technologies[]', tech));

        // Append Images
        selectedFiles.forEach(file => {
            data.append('images', file);
        });

        try {
            if (editingProject) {
                await api.projects.update(editingProject._id, data);
                toast.success('Project updated successfully!');
            } else {
                await api.projects.create(data);
                toast.success('Project created successfully!');
            }
            closeModal();
            fetchProjects();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save project');
        } finally {
            setSubmitting(false);
        }
    };

    const openCreateModal = () => {
        setEditingProject(null);
        setFormData({
            title: '',
            description: '',
            technologies: '',
            githubUrl: '',
            liveUrl: '',
            category: 'Web',
        });
        setSelectedFiles([]);
        setPreviewUrls([]);
        setIsModalOpen(true);
    };

    const openEditModal = (project: any) => {
        setEditingProject(project);
        setFormData({
            title: project.title || '',
            description: project.description || '',
            technologies: project.technologies?.join(', ') || '',
            githubUrl: project.githubUrl || '',
            liveUrl: project.liveUrl || '',
            category: project.category || 'Web',
        });
        setSelectedFiles([]);
        setPreviewUrls([]); // We don't preview existing images in this simple implementation yet, or we could show them separately
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await api.projects.delete(id);
            toast.success('Project deleted successfully!');
            fetchProjects();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete project');
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
        <div className="space-y-6 relative">
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-[#1e1e30] border border-purple-500/20 rounded-2xl w-full max-w-2xl shadow-2xl relative my-8">
                        <div className="p-6 border-b border-purple-500/20 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">
                                {editingProject ? 'Edit Project' : 'Add New Project'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="Web">Web Development</option>
                                        <option value="Mobile">Mobile App</option>
                                        <option value="UI/UX">UI/UX Design</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Technologies (comma separated)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="React, Node.js, TypeScript"
                                    value={formData.technologies}
                                    onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">GitHub URL</label>
                                    <input
                                        type="url"
                                        value={formData.githubUrl}
                                        onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Live URL</label>
                                    <input
                                        type="url"
                                        value={formData.liveUrl}
                                        onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Images</label>
                                <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-4 text-center hover:border-purple-500/50 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="project-images"
                                    />
                                    <label htmlFor="project-images" className="cursor-pointer flex flex-col items-center gap-2">
                                        <Plus className="w-8 h-8 text-purple-400" />
                                        <span className="text-gray-400 text-sm">Click to upload images</span>
                                    </label>
                                </div>

                                {/* Image Previews */}
                                {previewUrls.length > 0 && (
                                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                        {previewUrls.map((url, idx) => (
                                            <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-purple-500/30">
                                                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(idx)}
                                                    className="absolute top-0 right-0 bg-red-500/80 p-1 rounded-bl text-white"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Projects Management</h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/30"
                >
                    <Plus size={20} />
                    Add Project
                </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project._id}
                        className="bg-[#1e1e30] border border-purple-500/20 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                    >
                        {project.images && project.images[0] && (
                            <img
                                src={project.images[0]}
                                alt={project.title}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies?.slice(0, 3).map((tech: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-md"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                                    >
                                        <Github size={16} className="text-white" />
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                                    >
                                        <ExternalLink size={16} className="text-white" />
                                    </a>
                                )}
                                <button
                                    onClick={() => openEditModal(project)}
                                    className="ml-auto p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(project._id)}
                                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-400">No projects yet. Add your first project!</p>
                </div>
            )}
        </div>
    );
}
