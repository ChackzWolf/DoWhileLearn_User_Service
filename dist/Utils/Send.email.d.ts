import { IEmailService } from "../Interfaces/IUtils/IEmailService";
export declare class EmailService implements IEmailService {
    sendVerificationMail(email: string, otp: string): Promise<void>;
}
