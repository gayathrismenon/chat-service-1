import { Resend } from 'resend';
import config from "../config/config";

export class EmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend("re_Zp7sAqdn_6FDkzAzwwFD1bvteMPEVZeQh");
    }

    async sendEmail(to: string, subject: string, content: string) {
        try {
            const { data, error } = await this.resend.emails.send({
                from: 'onboarding@resend.dev',
                to: '2023sl93079@wilp.bits-pilani.ac.in',
                subject: subject,
                html: content,
            });

            if (error) {
                console.error("Error sending email:", error);
                return;
            }

            console.log("Email sent:", data);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }
}