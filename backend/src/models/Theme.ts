import mongoose, { Document, Schema } from 'mongoose';

export interface IThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundSecondary: string;
    text: string;
    textSecondary: string;
    border: string;
    cardBackground: string;
    cardHover: string;
}

export interface IThemeFonts {
    heading: string;
    body: string;
    code: string;
}

export interface IThemeEffects {
    borderRadius: string;
    shadow: string;
    shadowHover: string;
    glowColor: string;
}

export interface IThemeGradients {
    primary: string;
    secondary: string;
    accent: string;
}

export interface ITheme extends Document {
    name: string;
    colors: IThemeColors;
    fonts: IThemeFonts;
    effects: IThemeEffects;
    gradients: IThemeGradients;
    enableAnimations: boolean;
    scrollAnimation: string;
    faviconUrl: string;
    isActive: boolean;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const themeSchema = new Schema<ITheme>(
    {
        name: {
            type: String,
            required: [true, 'Theme name is required'],
            trim: true,
        },
        colors: {
            primary: { type: String, default: '#8b5cf6' },
            secondary: { type: String, default: '#a78bfa' },
            accent: { type: String, default: '#c084fc' },
            background: { type: String, default: '#0a0a0f' },
            backgroundSecondary: { type: String, default: '#1a1a2e' },
            text: { type: String, default: '#ffffff' },
            textSecondary: { type: String, default: '#a1a1aa' },
            border: { type: String, default: '#8b5cf6' },
            cardBackground: { type: String, default: '#1e1e30' },
            cardHover: { type: String, default: '#2a2a40' },
        },
        fonts: {
            heading: { type: String, default: 'Inter, sans-serif' },
            body: { type: String, default: 'Inter, sans-serif' },
            code: { type: String, default: 'Fira Code, monospace' },
        },
        effects: {
            borderRadius: { type: String, default: '1.5rem' },
            shadow: { type: String, default: '0 4px 20px rgba(139, 92, 246, 0.3)' },
            shadowHover: { type: String, default: '0 8px 30px rgba(139, 92, 246, 0.5)' },
            glowColor: { type: String, default: 'rgba(139, 92, 246, 0.5)' },
        },
        gradients: {
            primary: {
                type: String,
                default: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
            },
            secondary: {
                type: String,
                default: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            },
            accent: {
                type: String,
                default: 'linear-gradient(135deg, #c084fc 0%, #e879f9 100%)',
            },
        },
        enableAnimations: {
            type: Boolean,
            default: true
        },
        scrollAnimation: {
            type: String,
            default: 'smooth'
        },
        faviconUrl: {
            type: String,
            default: ''
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure only one active theme
themeSchema.pre('save', async function (next) {
    if (this.isActive) {
        await mongoose.model('Theme').updateMany(
            { _id: { $ne: this._id } },
            { isActive: false }
        );
    }
    next();
});

export const Theme = mongoose.model<ITheme>('Theme', themeSchema);
