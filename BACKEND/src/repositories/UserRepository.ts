import { BaseRepository } from './BaseRepository';
import User, { IUser } from '../models/User';

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return this.findOneBy({ email });
    }

    async findByEmailWithPassword(email: string): Promise<IUser | null> {
        return this._model.findOne({ email }).select('+password');
    }

    async findByGoogleId(googleId: string): Promise<IUser | null> {
        return this.findOneBy({ googleId });
    }

    async addPurchase(userId: string, lessonId: string): Promise<void> {
        await this._model.findByIdAndUpdate(userId, {
            $addToSet: { purchases: lessonId }
        });
    }

    async getPurchases(userId: string): Promise<any[]> {
        const user = await this._model.findById(userId).populate({
            path: 'purchases',
            populate: { path: 'instructor', select: 'name' }
        });
        return user ? user.purchases : [];
    }
}
