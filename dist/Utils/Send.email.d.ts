import { IEmailService } from "../Interfaces/IUtils/IEmailService";
export declare class EmailService implements IEmailService {
    sendVerificationMail(email: string, otp: string): Promise<void>;
    sendInfo(subject: string, message: string): Promise<void>;
}
