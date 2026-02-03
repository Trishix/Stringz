import { Resend } from 'resend';
import Logger from '../utils/Logger';

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

class EmailService {
    private resend: Resend;

    constructor() {
        // Initialize Resend with API Key
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not defined');
        }
        this.resend = new Resend(apiKey);
    }

    public async sendEmail(options: EmailOptions): Promise<void> {
        try {
            // Send email using Resend
            const { data, error } = await this.resend.emails.send({
                from: process.env.EMAIL_FROM || 'Stringz <onboarding@resend.dev>', // Default to resend test domain
                to: [options.to],
                subject: options.subject,
                text: options.text,
                html: options.html,
            });

            if (error) {
                Logger.error(`❌ Resend Error: ${error.message}`);
                return;
            }

            Logger.info(`📧 Email sent successfully: ${data?.id}`);
        } catch (error: any) {
            Logger.error(`❌ Error sending email: ${error.message}`);
        }
    }
}

export default new EmailService();
