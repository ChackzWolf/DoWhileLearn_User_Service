import nodemailer from "nodemailer"
import { configs } from "../Configs/ENV_configs/ENV.configs";
import { IEmailService } from "../Interfaces/IUtils/IEmailService";
import { Resend } from 'resend';


export class EmailService implements IEmailService {
    async sendVerificationMail(email: string, otp: string): Promise<void> {
        try {
            const resend = new Resend(process.env.EMAIL_PASSWORD);

            await resend.emails.send({
                from: 'DoWhileLearn <onboarding@resend.dev>',
                to: email,
                subject: 'Email Verification',
                html: `<p>Code: ${otp}</p>`
            });
        } catch (error) {
            console.log(error)
        }
    }

    async sendInfo(subject: string, message: string): Promise<void> {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: configs.DWL_EMAIL,
                    pass: configs.EMAIL_PASSWORD
                },
            });

            const mailOptions = {
                from: 'DoWhileLearn <dowhilelearn@gmail.com>',
                to: 'jacksoncheriyan05@gmail.com',
                subject: subject,
                html: `<p>${message}</p>`
            };

            await transporter.sendMail(mailOptions);
        } catch (error) {
            throw new Error(`Failed to send verification email: ${error}`);
        }
    }
}
