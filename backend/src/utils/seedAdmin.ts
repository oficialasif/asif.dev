import dotenv from 'dotenv';
import { connectDatabase } from './database';
import { User } from '../models/User';

dotenv.config();

const seedAdmin = async () => {
    try {
        console.log('🌱 Seeding admin user...');

        await connectDatabase();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            console.log('Email:', existingAdmin.email);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            username: 'asifmahmud',
            email: 'asifmahmud053@gmail.com',
            password: 'asif*admin.port',
            role: 'admin',
            isActive: true,
        });

        console.log('✅ Admin user created successfully');
        console.log('Username:', admin.username);
        console.log('Email:', admin.email);
        console.log('Password: asif*admin.port');
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
