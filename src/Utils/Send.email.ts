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
            connectionTimeout: 10000, // 10 second timeout
            greetingTimeout: 5000,
            socketTimeout: 10000,
            auth: {
                user: 'dowhilelearn@outlook.com',
                pass: 'Jacks@123',
            }
        });

        console.log('📧 Transporter created, skipping verify...');
        
        // Skip verify, go straight to send
        const mailOptions = {
            from: 'DoWhileLearn <dowhilelearn@outlook.com>',
            to: email,
            subject: 'E-Mail Verification',
            html: `<p>Hello alien. Please enter the code: ${otp} to verify your email address and start your journey with DoWhileLearn</p>`
        };

        console.log('📤 Attempting to send email to:', email);
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', result.messageId);
        
    } catch (error: any) {
        console.error('❌ Email failed:', error.message);
        
        // Fallback: Just log the OTP for now
        console.log('🔑 EMAIL FALLBACK - OTP for', email, ':', otp);
        console.log('📧 Check console for verification code');
        
        // Don't throw error so app doesn't break
        return;
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
