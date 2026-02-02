import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    lessonId: mongoose.Types.ObjectId;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String
}, {
    timestamps: true
});

// Indexes
transactionSchema.index({ userId: 1 });
transactionSchema.index({ lessonId: 1 });
transactionSchema.index({ status: 1 });

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
