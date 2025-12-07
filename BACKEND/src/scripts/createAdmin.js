const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user');
const path = require('path');

// Load environment variables from the parent directory's .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to DB');

        const adminEmail = 'trishit.swarnakar2024@nst.rishihood.edu.in';
        const adminPassword = '132006';
        const adminName = 'Trishit Swarnakar';

        // Check if user exists
        let user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log('User already exists. Updating role to admin...');
            user.role = 'admin';
            user.password = adminPassword; // Update password just in case
            await user.save();
            console.log('✅ User updated to Admin successfully');
        } else {
            console.log('Creating new Admin user...');
            user = await User.create({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            console.log('✅ Admin user created successfully');
        }

        console.log('\n================================');
        console.log('Login Credentials:');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('================================\n');

        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
