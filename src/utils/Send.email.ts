import nodemailer from "nodemailer"
import { configs } from "../Configs/ENV_configs/ENV.configs";


export const SendVerificationMail = async (email: string, otp: string): Promise<void> => {
    try {
        console.log(configs.DWL_EMAIL, 'Sender')
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: configs.DWL_EMAIL,
                pass: configs.DWL_PASSWORD
            },
        });
        console.log('mail');

        const mailOptions = {
            from: 'DoWhileLearn <dowhilelearn@gmail.com>',
            to: email,
            subject: 'E-Mail Verification',
            html: `<p>Hello alien. Please enter the code:${otp}  to verify your email address and start your journey with DoWhileLearn</p>`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(`Failed to send verification email: ${error}`);
    }
};
