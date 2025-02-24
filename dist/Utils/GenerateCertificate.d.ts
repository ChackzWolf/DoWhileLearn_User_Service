interface ICertificateData {
    studentName: string;
    courseName: string;
    completionDate: string;
    certificateId: string;
    instructorName: string;
}
interface ICertificateGenerator {
    generateCertificate(certificateData: ICertificateData): Promise<Buffer>;
}
export declare class CertificateGenerator implements ICertificateGenerator {
    private readonly defaultStyles;
    generateCertificate(certificateData: ICertificateData): Promise<Buffer>;
    private addBorders;
    private addLogo;
    private addContent;
    private addFooter;
    private addSignatureLine;
}
export {};
