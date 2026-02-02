import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { IRead, IWrite } from '../interfaces';

export abstract class BaseRepository<T extends Document> implements IWrite<T>, IRead<T> {
    protected _model: Model<T>;

    constructor(schemaModel: Model<T>) {
        this._model = schemaModel;
    }

    async create(item: Partial<T>): Promise<T> {
        return await this._model.create(item);
    }

    async update(id: string, item: UpdateQuery<T>): Promise<T | null> {
        return await this._model.findByIdAndUpdate(id, item, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await this._model.findByIdAndDelete(id);
        return !!result;
    }

    async find(item: FilterQuery<T>): Promise<T[]> {
        return await this._model.find(item);
    }

    async findOne(id: string): Promise<T | null> {
        return await this._model.findById(id);
    }

    async findOneBy(item: FilterQuery<T>): Promise<T | null> {
        return await this._model.findOne(item);
    }
}
