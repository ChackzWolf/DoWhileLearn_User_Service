import nodemailer from "nodemailer"
import { configs } from "../Configs/ENV_configs/ENV.configs";
import { IEmailService } from "../Interfaces/IUtils/IEmailService";


export class EmailService implements IEmailService {
    async sendVerificationMail(email: string, otp: string): Promise<void> {
        try {
            console.log('Email credentials check:', {
                email: configs.DWL_EMAIL ? 'Set' : 'Missing',
                password: configs.EMAIL_PASSWORD ? 'Set' : 'Missing'
            });

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // false for 587, true for 465
                auth: {
                    user: configs.DWL_EMAIL,
                    pass: configs.EMAIL_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // Test the connection
            await transporter.verify();
            console.log('SMTP connection verified');

            const mailOptions = {
                from: 'DoWhileLearn <dowhilelearn05@gmail.com>',
                to: email,
                subject: 'E-Mail Verification',
                html: `<p>Hello alien. Please enter the code: ${otp} to verify your email address and start your journey with DoWhileLearn</p>`
            };

            const result = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', result.messageId);
        } catch (error) {
            console.error('Email sending failed:', error);
            throw new Error(`Failed to send verification email: ${error}`);
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
