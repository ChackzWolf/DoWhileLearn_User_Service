import PDFKit from 'pdfkit';

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

export class CertificateGenerator implements ICertificateGenerator {
    private readonly defaultStyles = {
        pageSize: [842, 595], // A4 Landscape
        margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        },
        colors: {
            primary: '#1a365d',    // Deep blue
            secondary: '#718096',  // Slate gray
            text: '#2d3748',      // Dark gray
            border: '#cbd5e0'     // Light gray
        },
        fonts: {
            title: 'Helvetica-Bold',
            body: 'Helvetica'
        }
    };

    public async generateCertificate(certificateData: ICertificateData): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const chunks: Buffer[] = [];
                const doc = new PDFKit({
                    size: this.defaultStyles.pageSize,
                    margins: this.defaultStyles.margins,
                    bufferPages: true
                });

                doc.on('data', (chunk: Buffer) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                this.addBorders(doc);
                this.addLogo(doc);
                this.addContent(doc, certificateData);
                this.addFooter(doc, certificateData);

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    private addBorders(doc: PDFKit.PDFDocument): void {
        // Elegant double border
        const outerMargin = 40;
        const innerMargin = 60;
        
        // Outer border
        doc.rect(outerMargin, outerMargin, 
                 doc.page.width - (outerMargin * 2), 
                 doc.page.height - (outerMargin * 2))
           .lineWidth(2)
           .stroke(this.defaultStyles.colors.primary);

        // Inner border
        doc.rect(innerMargin, innerMargin, 
                 doc.page.width - (innerMargin * 2), 
                 doc.page.height - (innerMargin * 2))
           .lineWidth(1)
           .stroke(this.defaultStyles.colors.border);
    }

    private addLogo(doc: PDFKit.PDFDocument): void {
        const logoY = 90;
        
        // Simple, elegant logo presentation
        doc.fontSize(32)
           .font(this.defaultStyles.fonts.title)
           .fillColor(this.defaultStyles.colors.primary)
           .text('DoWhile {Learn}', 0, logoY, {
               align: 'center',
               width: doc.page.width
           });

        // Subtle underline
        const lineWidth = 200;
        const lineY = logoY + 45;
        doc.moveTo((doc.page.width - lineWidth) / 2, lineY)
           .lineTo((doc.page.width + lineWidth) / 2, lineY)
           .lineWidth(1)
           .stroke(this.defaultStyles.colors.border);
    }

    private addContent(doc: PDFKit.PDFDocument, certificateData: ICertificateData): void {
        const centerY = doc.page.height / 2 - 30;

        // Certificate title
        doc.fontSize(46)
           .font(this.defaultStyles.fonts.title)
           .fillColor(this.defaultStyles.colors.primary)
           .text('Certificate of Completion', 0, centerY - 100, {
               align: 'center',
               width: doc.page.width
           });

        // Main content with improved spacing
        doc.fontSize(24)
           .font(this.defaultStyles.fonts.body)
           .fillColor(this.defaultStyles.colors.text)
           .text('This is to certify that', 0, centerY, {
               align: 'center',
               width: doc.page.width
           });

        // Student name
        doc.fontSize(36)
           .font(this.defaultStyles.fonts.title)
           .fillColor(this.defaultStyles.colors.primary)
           .text(certificateData.studentName, 0, centerY + 40, {
               align: 'center',
               width: doc.page.width
           });

        // Course completion text
        doc.fontSize(18)
           .font(this.defaultStyles.fonts.body)
           .fillColor(this.defaultStyles.colors.text)
           .text('has successfully completed the course', 0, centerY + 100, {
               align: 'center',
               width: doc.page.width
           });

        // Course name
        doc.fontSize(28)
           .font(this.defaultStyles.fonts.title)
           .fillColor(this.defaultStyles.colors.primary)
           .text(certificateData.courseName, 0, centerY + 140, {
               align: 'center',
               width: doc.page.width
           });
    }

    private addFooter(doc: PDFKit.PDFDocument, certificateData: ICertificateData): void {
        const signatureY = doc.page.height - 150;
        
        // Signature lines with labels
        this.addSignatureLine(doc, 'Date', certificateData.completionDate, 150, signatureY);
        this.addSignatureLine(doc, 'Instructor', certificateData.instructorName, doc.page.width - 350, signatureY);

        // Certificate ID with subtle styling
        doc.fontSize(10)
           .fillColor(this.defaultStyles.colors.secondary)
           .text(`Certificate ID: ${certificateData.certificateId}`, 70, doc.page.height - 70);
    }

    private addSignatureLine(doc: PDFKit.PDFDocument, label: string, value: string, x: number, y: number): void {
        const lineWidth = 200;
        
        // Signature value
        doc.fontSize(14)
           .font(this.defaultStyles.fonts.body)
           .fillColor(this.defaultStyles.colors.text)
           .text(value, x, y, {
               width: lineWidth,
               align: 'center'
           });

        // Signature line
        doc.moveTo(x, y + 25)
           .lineTo(x + lineWidth, y + 25)
           .lineWidth(1)
           .stroke(this.defaultStyles.colors.primary);

        // Label
        doc.fontSize(12)
           .fillColor(this.defaultStyles.colors.secondary)
           .text(label, x, y + 35, {
               width: lineWidth,
               align: 'center'
           });
    }
}