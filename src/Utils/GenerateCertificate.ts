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
            primary: '#2563eb',    // Blue
            secondary: '#1e40af',  // Darker Blue
            text: '#1f2937'        // Dark Gray
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
                    margins: this.defaultStyles.margins
                });

                // Collect the PDF data chunks
                doc.on('data', (chunk: Buffer) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                this.addBackground(doc);
                this.addLogo(doc);
                this.addContent(doc, certificateData);

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    private addBackground(doc: PDFKit.PDFDocument): void {
        doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
           .lineWidth(2)
           .stroke(this.defaultStyles.colors.primary);

        this.addCornerDecoration(doc, 30, 30);
        this.addCornerDecoration(doc, doc.page.width - 30, 30);
        this.addCornerDecoration(doc, 30, doc.page.height - 30);
        this.addCornerDecoration(doc, doc.page.width - 30, doc.page.height - 30);
    }

    private addCornerDecoration(doc: PDFKit.PDFDocument, x: number, y: number): void {
        doc.save()
           .translate(x, y)
           .path('M 0,0 L 20,0 M 0,0 L 0,20')
           .lineWidth(3)
           .stroke(this.defaultStyles.colors.secondary);
    }

    private addLogo(doc: PDFKit.PDFDocument): void {
        doc.fontSize(24)
           .font(this.defaultStyles.fonts.title)
           .fillColor(this.defaultStyles.colors.primary)
           .text('DoWhile {Learn}', 50, 70, {
               align: 'center'
           });
    }

    private addContent(doc: PDFKit.PDFDocument, certificateData: ICertificateData): void {
        const centerY = doc.page.height / 2;

        doc.fontSize(36)
           .font(this.defaultStyles.fonts.title)
           .fillColor(this.defaultStyles.colors.primary)
           .text('Certificate of Completion', 0, centerY - 100, {
               align: 'center'
           });

        doc.fontSize(24)
           .font(this.defaultStyles.fonts.body)
           .fillColor(this.defaultStyles.colors.text)
           .text('This is to certify that', 0, centerY - 20, {
               align: 'center'
           });

        doc.fontSize(28)
           .font(this.defaultStyles.fonts.title)
           .fillColor(this.defaultStyles.colors.primary)
           .text(certificateData.studentName, 0, centerY + 20, {
               align: 'center'
           });

        doc.fontSize(16)
           .font(this.defaultStyles.fonts.body)
           .fillColor(this.defaultStyles.colors.text)
           .text(`has successfully completed the course`, 0, centerY + 70, {
               align: 'center'
           });

        doc.fontSize(24)
           .font(this.defaultStyles.fonts.title)
           .fillColor(this.defaultStyles.colors.primary)
           .text(certificateData.courseName, 0, centerY + 100, {
               align: 'center'
           });

        doc.fontSize(12)
           .font(this.defaultStyles.fonts.body)
           .fillColor(this.defaultStyles.colors.text)
           .text(certificateData.completionDate, 150, centerY + 180);

        doc.fontSize(12)
           .text(certificateData.instructorName, doc.page.width - 250, centerY + 180);

        doc.moveTo(150, centerY + 170)
           .lineTo(350, centerY + 170)
           .stroke();

        doc.moveTo(doc.page.width - 350, centerY + 170)
           .lineTo(doc.page.width - 150, centerY + 170)
           .stroke();

        doc.fontSize(10)
           .text(`Certificate ID: ${certificateData.certificateId}`, 50, doc.page.height - 70);
    }
}