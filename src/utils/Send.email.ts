import nodemailer from "nodemailer"
import { configs } from "../Configs/ENV_configs/ENV.configs";
import { IEmailService } from "../Interfaces/IUtils/IEmailService";


export class EmailService implements IEmailService {
    async sendVerificationMail(email: string, otp: string): Promise<void> {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: configs.DWL_EMAIL,
                    pass: configs.DWL_PASSWORD
                },
            });

            const mailOptions = {
                from: 'DoWhileLearn <dowhilelearn@gmail.com>',
                to: email,
                subject: 'E-Mail Verification',
                html: `<p>Hello alien. Please enter the code: ${otp} to verify your email address and start your journey with DoWhileLearn</p>`
            };

            await transporter.sendMail(mailOptions);
        } catch (error) {
            throw new Error(`Failed to send verification email: ${error}`);
        }
    }
}
