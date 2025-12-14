// Profile Data Types
export interface ProfileData {
    _id?: string;
    name?: string;
    title?: string;
    bio?: string;
    profileImage?: string;
    profileImagePublicId?: string;
    email?: string;
    phone?: string;
    location?: string;
    socialLinks?: {
        github?: string;
        linkedin?: string;
        facebook?: string;
        twitter?: string;
    };
    skills?: string[];
    updatedAt?: Date;
}

// Project Data Types
export interface Project {
    _id?: string;
    title: string;
    description: string;
    images: Array<{
        url: string;
        publicId?: string;
    }>;
    githubUrl?: string;
    liveUrl?: string;
    techStack: string[];
    featured: boolean;
    order: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Music Track Types
export interface MusicTrack {
    _id?: string;
    title: string;
    artist: string;
    coverImage: string;
    coverImagePublicId?: string;
    audioUrl: string;
    duration?: number;
    order: number;
    createdAt?: Date;
}

// Gallery Image Types
export interface GalleryImage {
    _id?: string;
    url: string;
    publicId?: string;
    caption?: string;
    category?: string;
    order: number;
    createdAt?: Date;
}

// Interest Types
export interface Interest {
    _id?: string;
    name: string;
    icon: string;
    description?: string;
    order: number;
}

// Contact Info Types
export interface ContactInfo {
    _id?: string;
    email: string;
    phone?: string;
    location: string;
    socialLinks: {
        github?: string;
        linkedin?: string;
        facebook?: string;
        twitter?: string;
        instagram?: string;
    };
    updatedAt?: Date;
}

// Theme Settings Types
export interface ThemeSettings {
    _id?: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
    layout: {
        gridGap: number;
        cardBorderRadius: number;
    };
    updatedAt?: Date;
}

// Admin User Types
export interface AdminUser {
    _id?: string;
    username: string;
    password: string; // Hashed
    createdAt?: Date;
    updatedAt?: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
