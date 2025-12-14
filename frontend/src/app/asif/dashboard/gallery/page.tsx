'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Upload, Trash2 } from 'lucide-react';

export default function GalleryManagementPage() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Nature');
    const [customCategory, setCustomCategory] = useState('');
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await api.gallery.getAll();
            setImages(response.data.data.images || []);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setTitle(file.name.split('.')[0]); // Default title from filename
        setPreviewUrl(URL.createObjectURL(file));
        // Reset category state
        setCategory('Nature');
        setIsCustomCategory(false);
        setCustomCategory('');
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('title', title);

        const finalCategory = isCustomCategory ? customCategory : category;
        formData.append('category', finalCategory);

        try {
            await api.gallery.upload(formData);
            toast.success('Image uploaded successfully!');
            fetchImages();
            cancelUpload();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const cancelUpload = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setTitle('');
        setCategory('Nature');
        setCustomCategory('');
        setIsCustomCategory(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            await api.gallery.delete(id);
            toast.success('Image deleted successfully!');
            fetchImages();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete image');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const categories = ['Nature', 'Urban', 'Art', 'Tech', 'Other'];

    return (
        <div className="space-y-6 relative">
            {/* Upload Modal Overlay */}
            {selectedFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1e1e30] border border-purple-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                        <h2 className="text-xl font-bold text-white mb-4">Upload Image Details</h2>

                        {/* Preview */}
                        {previewUrl && (
                            <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4 border border-purple-500/30">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Title Input */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="Image Title"
                                />
                            </div>

                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Category</label>
                                <div className="flex gap-2 mb-2">
                                    <select
                                        value={isCustomCategory ? 'custom' : category}
                                        onChange={(e) => {
                                            if (e.target.value === 'custom') {
                                                setIsCustomCategory(true);
                                            } else {
                                                setIsCustomCategory(false);
                                                setCategory(e.target.value);
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="custom">Custom...</option>
                                    </select>
                                </div>
                                {isCustomCategory && (
                                    <input
                                        type="text"
                                        value={customCategory}
                                        onChange={(e) => setCustomCategory(e.target.value)}
                                        className="w-full px-4 py-2 bg-[#0a0a0f] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        placeholder="Enter custom category"
                                        autoFocus
                                    />
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={cancelUpload}
                                    className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
                                >
                                    {uploading ? 'Uploading...' : 'Confirm Upload'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Gallery Management</h1>
                <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/30 cursor-pointer">
                    <Upload size={20} />
                    Upload Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </label>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                    <div
                        key={image._id}
                        className="relative group bg-[#1e1e30] border border-purple-500/20 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                    >
                        <img
                            src={image.imageUrl}
                            alt={image.title}
                            className="w-full h-48 object-cover"
                        />
                        {/* Category Badge */}
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white">
                            {image.category || 'Uncategorized'}
                        </div>

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={() => handleDelete(image._id)}
                                className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                        <div className="p-3">
                            <p className="text-sm text-white truncate">{image.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {images.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-400">No images yet. Upload your first image!</p>
                </div>
            )}
        </div>
    );
}
