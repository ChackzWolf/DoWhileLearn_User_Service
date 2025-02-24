export declare const uploadFile: (videoBinary: any) => Promise<{
    publicUrl: string;
}>;
export declare const uploadImage: (imageBinary: Buffer, imageName: string) => Promise<{
    publicUrl: string;
}>;
export declare const uploadPDF: (pdfBinary: Buffer, pdfName: string) => Promise<{
    publicUrl: string;
}>;
