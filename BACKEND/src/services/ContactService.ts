import { ContactRepository } from '../repositories/ContactRepository';
import { IContact } from '../models/Contact';

import emailService from './EmailService';
import Logger from '../utils/Logger';

export class ContactService {
    private contactRepository: ContactRepository;

    constructor() {
        this.contactRepository = new ContactRepository();
    }

    async createContact(data: Partial<IContact>): Promise<IContact> {
        const contact = await this.contactRepository.create(data);

        // Send Email Notification to Admin
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
            await emailService.sendEmail({
                to: adminEmail,
                subject: `New Contact Message from ${data.name}`,
                text: `You have received a new message from ${data.name} (${data.email}):\n\n${data.message}`,
                html: `<p>You have received a new message from <strong>${data.name}</strong> (${data.email}):</p><p>${data.message}</p>`
            });
        } else {
            Logger.warn('⚠️ ADMIN_EMAIL not defined. Contact notification not sent.');
        }

        return contact;
    }

    async getAllContacts(): Promise<IContact[]> {
        return await this.contactRepository.find({});
    }
}
