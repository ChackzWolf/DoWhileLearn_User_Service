import nodemailer from "nodemailer"


export const SendVerificationMail = async (email: string, otp: string): Promise<void> => {
    try {
        console.log(process.env.EMAIL, 'Sender')
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
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
