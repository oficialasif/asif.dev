import mongoose, { Document, Schema } from 'mongoose';

export interface INotice {
    text: string;
    type: 'info' | 'warning' | 'success' | 'error';
    isActive: boolean;
    priority: number;
}

export interface IAlert {
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    isActive: boolean;
    expiresAt?: Date;
}

export interface ILoadingAnimation {
    type: 'spinner' | 'dots' | 'pulse' | 'custom';
    customUrl?: string;
    color?: string;
}

export interface ISiteSettings extends Document {
    siteTitle: string;
    siteUrl: string;
    siteDescription: string;
    siteLogo?: string;
    siteLogoCloudinaryId?: string;
    favicon?: string;
    faviconCloudinaryId?: string;
    notices: INotice[];
    alerts: IAlert[];
    loadingAnimation: ILoadingAnimation;
    customCSS?: string;
    customJS?: string;
    maintenanceMode: boolean;
    maintenanceMessage?: string;
    seo: {
        metaTitle?: string;
        metaDescription?: string;
        metaKeywords?: string[];
        ogImage?: string;
    };
    analytics: {
        googleAnalyticsId?: string;
        facebookPixelId?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
    {
        siteTitle: {
            type: String,
            required: [true, 'Site title is required'],
            default: 'DEV ASIF',
        },
        siteUrl: {
            type: String,
            required: [true, 'Site URL is required'],
            default: 'http://localhost:3000',
        },
        siteDescription: {
            type: String,
            default: 'Modern Portfolio Website',
        },
        siteLogo: {
            type: String,
        },
        siteLogoCloudinaryId: {
            type: String,
        },
        favicon: {
            type: String,
        },
        faviconCloudinaryId: {
            type: String,
        },
        notices: [
            {
                text: { type: String, required: true },
                type: {
                    type: String,
                    enum: ['info', 'warning', 'success', 'error'],
                    default: 'info',
                },
                isActive: { type: Boolean, default: true },
                priority: { type: Number, default: 0 },
            },
        ],
        alerts: [
            {
                message: { type: String, required: true },
                type: {
                    type: String,
                    enum: ['info', 'warning', 'success', 'error'],
                    default: 'info',
                },
                isActive: { type: Boolean, default: true },
                expiresAt: Date,
            },
        ],
        loadingAnimation: {
            type: {
                type: String,
                enum: ['spinner', 'dots', 'pulse', 'custom'],
                default: 'spinner',
            },
            customUrl: String,
            color: { type: String, default: '#8b5cf6' },
        },
        customCSS: {
            type: String,
        },
        customJS: {
            type: String,
        },
        maintenanceMode: {
            type: Boolean,
            default: false,
        },
        maintenanceMessage: {
            type: String,
            default: 'Site is under maintenance. Please check back soon!',
        },
        seo: {
            metaTitle: String,
            metaDescription: String,
            metaKeywords: [String],
            ogImage: String,
        },
        analytics: {
            googleAnalyticsId: String,
            facebookPixelId: String,
        },
    },
    {
        timestamps: true,
    }
);

export const SiteSettings = mongoose.model<ISiteSettings>(
    'SiteSettings',
    siteSettingsSchema
);
