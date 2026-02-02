import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ContactService } from '../services/ContactService';

export class ContactController extends BaseController {
    private contactService: ContactService;

    constructor() {
        super();
        this.contactService = new ContactService();
    }

    public createContact = async (req: Request, res: Response) => {
        try {
            const result = await this.contactService.createContact(req.body);
            return this.created(res, result);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public getAllContacts = async (req: Request, res: Response) => {
        try {
            const result = await this.contactService.getAllContacts();
            return this.ok(res, result);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }
}
