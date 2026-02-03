import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';
import Logger from '../utils/Logger';

// Load environment variables from the parent directory's .env file if running from src/scripts
// Or just load generic .env
dotenv.config();

const createAdmin = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        Logger.info('✅ Connected to DB');

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminName = process.env.ADMIN_NAME;

        if (!adminEmail || !adminPassword || !adminName) {
            throw new Error('Admin credentials not defined in .env');
        }

        // Check if user exists
        let user = await User.findOne({ email: adminEmail });

        if (user) {
            Logger.info('User already exists. Updating role to admin...');
            user.role = 'admin';
            user.password = adminPassword; // Update password just in case (Will be hashed by pre-save hook)
            await user.save();
            Logger.info('✅ User updated to Admin successfully');
        } else {
            Logger.info('Creating new Admin user...');
            user = await User.create({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            Logger.info('✅ Admin user created successfully');
        }

        console.log('\n================================');
        console.log('Login Credentials:');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('================================\n');

        await mongoose.disconnect();
    } catch (error: any) {
        Logger.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
