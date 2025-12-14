import dotenv from 'dotenv';
import { connectDatabase } from './database';
import { User } from '../models/User';

dotenv.config();

const updateAdmin = async () => {
    try {
        console.log('🔄 Updating admin user...');

        await connectDatabase();

        // Delete all existing admin users
        const deleteResult = await User.deleteMany({ role: 'admin' });
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing admin user(s)`);

        // Create new admin user
        const admin = await User.create({
            username: 'asifmahmud',
            email: 'asifmahmud053@gmail.com',
            password: 'asif*admin.port',
            role: 'admin',
            isActive: true,
        });

        console.log('✅ New admin user created successfully');
        console.log('Username:', admin.username);
        console.log('Email:', admin.email);
        console.log('Password: asif*admin.port');
        console.log('\n🎉 You can now login with the new credentials!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating admin:', error);
        process.exit(1);
    }
};

updateAdmin();
