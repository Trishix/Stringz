import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    avatar?: string;
    role: 'student' | 'admin';
    purchases: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [
                function (this: IUser) {
                    return !this.googleId;
                },
                'Please provide a password',
            ],
            minlength: 6,
            select: false,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
            select: false,
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            enum: ['student', 'admin'],
            default: 'student',
        },
        purchases: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Lesson',
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    // Only hash if password exists (could be missing for Google Auth updates)
    if (this.password) {
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
