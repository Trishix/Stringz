const User = require('../models/user');
const { generateToken } = require('../utils/jwt');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = await User.create({
            name,
            email,
            password
        });

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                purchases: user.purchases
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id, user.role);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                purchases: user.purchases
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, email, picture, sub: googleId } = ticket.getPayload();

        let user = await User.findOne({
            $or: [{ email }, { googleId }]
        });

        if (user) {
            // If user exists but doesn't have googleId yet (signed up with email/password)
            if (!user.googleId) {
                user.googleId = googleId;
                if (!user.avatar) user.avatar = picture;
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                avatar: picture,
                password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) // Dummy password
            });
        }

        const jwtToken = generateToken(user._id, user.role);

        res.json({
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                purchases: user.purchases
            }
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Google login failed', error: error.message });
    }
};
