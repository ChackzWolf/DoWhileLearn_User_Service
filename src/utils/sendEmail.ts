import nodemailer from "nodemailer"


export const SendVerificationMail = async (email: string, otp: string): Promise<void> => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
        });
        console.log('mail');

        const mailOptions = {
            from: 'Climbr <DoWhileLearn@gmail.com>',
            to: email,
            subject: 'E-Mail Verification',
            html: `<p>Please enter the code:${otp}  to verify your email.</p>`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(`Failed to send verification email: ${error}`);
    }
};
