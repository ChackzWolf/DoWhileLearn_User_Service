import nodemailer from "nodemailer"
import { configs } from "../Configs/ENV_configs/ENV.configs";
import { IEmailService } from "../Interfaces/IUtils/IEmailService";


export class EmailService implements IEmailService {
async sendVerificationMail(email: string, otp: string): Promise<void> {
    try {
        console.log('🔄 Starting email send process...');
        
        const transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: 'dowhilelearn@outlook.com',
                pass: 'Jacks@123',
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });

        console.log('📧 Transporter created, testing connection...');
        
        // Test connection first
        await transporter.verify();
        console.log('✅ SMTP connection verified');

        const mailOptions = {
            from: 'DoWhileLearn <dowhilelearn@outlook.com>', // Must match auth user
            to: email,
            subject: 'E-Mail Verification',
            html: `<p>Hello alien. Please enter the code: ${otp} to verify your email address and start your journey with DoWhileLearn</p>`
        };

        console.log('📤 Sending email to:', email);
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', result.messageId);
        
    } catch (error:any) {
        console.error('❌ Email failed:', error.message);
        throw new Error(`Failed to send verification email: ${error.message}`);
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
