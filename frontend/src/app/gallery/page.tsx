'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ContentArea } from '@/components/ContentArea';
import { api } from '@/lib/api';
import Image from 'next/image';

export default function GalleryPage() {
    const [images, setImages] = useState<any[]>([]);
    const [filteredImages, setFilteredImages] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await api.gallery.getAll();
            const fetchedImages = response.data.data.images || [];
            setImages(fetchedImages);
            setFilteredImages(fetchedImages);

            // Extract unique categories
            const uniqueCategories = ['All', ...Array.from(new Set(fetchedImages.map((img: any) => img.category))).filter(Boolean)];
            setCategories(uniqueCategories as string[]);
        } catch (error) {
            console.error('Failed to fetch gallery images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        if (category === 'All') {
            setFilteredImages(images);
        } else {
            setFilteredImages(images.filter(img => img.category === category));
        }
    };

    return (
        <DashboardLayout>
            <ContentArea
                title="Gallery"
                description="A collection of my photography and design work"
                enableMagnetism={false}
            >
                <div className="space-y-6">
                    {/* Category Filter */}
                    <div className="flex gap-3 flex-wrap">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className={`px-6 py-2 rounded-xl transition-all duration-300 ${activeCategory === category
                                    ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)]'
                                    : 'bg-purple-900/20 border border-purple-500/30 text-purple-100 hover:border-purple-400/50 hover:bg-purple-900/30'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Gallery Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                            {filteredImages.length > 0 ? (
                                filteredImages.map((image) => (
                                    <div
                                        key={image._id}
                                        className="group relative aspect-square bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(137,42,220,0.3)] cursor-pointer"
                                    >
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            <h3 className="text-white font-semibold text-sm">{image.title}</h3>
                                            <p className="text-purple-300 text-xs">{image.category}</p>
                                        </div>

                                        {/* Category badge */}
                                        <div className="absolute top-3 right-3 px-3 py-1 bg-purple-600/80 backdrop-blur-sm rounded-full text-xs text-white">
                                            {image.category}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-purple-200/50">
                                    No images found in this category.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </ContentArea>
        </DashboardLayout>
    );
}
