interface ICertificateData {
    studentName: string;
    courseName: string;
    completionDate: string;
    certificateId: string;
    instructorName: string;
}
export interface ICertificateGenerator {
    generateCertificate(userData: ICertificateData): Promise<Buffer>;
}
export {};
