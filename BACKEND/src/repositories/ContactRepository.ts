import { BaseRepository } from './BaseRepository';
import Contact, { IContact } from '../models/Contact';

export class ContactRepository extends BaseRepository<IContact> {
    constructor() {
        super(Contact);
    }
}
