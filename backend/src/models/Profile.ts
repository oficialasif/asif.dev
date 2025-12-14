import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience {
    position: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    responsibilities: string[];
}

export interface IEducation {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    gpa?: string;
}

export interface ISkill {
    name: string;
    level: number;
}

export interface ISocialLink {
    platform: string;
    url: string;
}

export interface ILanguage {
    name: string;
    proficiency: string;
}

export interface IProfile extends Document {
    name: string;
    title: string;
    tagline: string;
    avatar: string;
    location: string;
    email: string;
    phone: string;
    bio: string;
    about: string;

    // Stats
    stats: {
        experience: string;
        projects: string;
        clients: string;
        awards: string;
    };

    // Lists
    experience: IExperience[];
    education: IEducation[];
    coreSkills: ISkill[];
    languages: ILanguage[];
    interests: string[];
    socialLinks: ISocialLink[];

    // Additional items from mock data
    certifications: {
        name: string;
        issuer: string;
        date: string;
        credentialId?: string;
    }[];
    achievements: {
        title: string;
        description: string;
        date: string;
    }[];
}

const profileSchema = new Schema<IProfile>(
    {
        name: { type: String },
        title: { type: String },
        tagline: { type: String },
        avatar: { type: String },
        location: { type: String },
        email: { type: String },
        phone: { type: String },
        bio: { type: String },
        about: { type: String },

        stats: {
            experience: { type: String, default: '0' },
            projects: { type: String, default: '0' },
            clients: { type: String, default: '0' },
            awards: { type: String, default: '0' }
        },

        experience: [{
            position: { type: String },
            company: { type: String },
            location: { type: String },
            startDate: { type: String },
            endDate: { type: String },
            current: { type: Boolean, default: false },
            description: { type: String },
            responsibilities: [{ type: String }]
        }],

        education: [{
            degree: { type: String },
            institution: { type: String },
            location: { type: String },
            startDate: { type: String },
            endDate: { type: String },
            description: { type: String },
            gpa: { type: String }
        }],

        coreSkills: [{
            name: { type: String },
            level: { type: Number }
        }],

        languages: [{
            name: { type: String },
            proficiency: { type: String }
        }],

        interests: [{ type: String }],

        socialLinks: [{
            platform: { type: String },
            url: { type: String }
        }],

        certifications: [{
            name: { type: String },
            issuer: { type: String },
            date: { type: String },
            credentialId: { type: String }
        }],

        achievements: [{
            title: { type: String },
            description: { type: String },
            date: { type: String }
        }]
    },
    {
        timestamps: true
    }
);

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
