import { BaseRepository } from './BaseRepository';
import Transaction, { ITransaction } from '../models/Transaction';

export class TransactionRepository extends BaseRepository<ITransaction> {
    constructor() {
        super(Transaction);
    }

    async findByUser(userId: string): Promise<ITransaction[]> {
        return this._model.find({ userId }).sort({ createdAt: -1 });
    }
}
