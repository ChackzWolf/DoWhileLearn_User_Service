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
            primary: '#2B3499',    // Rich blue
            secondary: '#FF6C22',  // Vibrant orange
            text: '#2B2730',       // Dark gray for better readability
            accent: '#FFE5CA',     // Light orange
            border: '#BAB2B5'      // Subtle border color
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

                this.addBackground(doc);
                this.addDecorations(doc);
                this.addLogo(doc);
                this.addContent(doc, certificateData);
                this.addFooter(doc, certificateData);

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    private addBackground(doc: PDFKit.PDFDocument): void {
        // Add subtle gradient background
        doc.rect(0, 0, doc.page.width, doc.page.height)
           .fill(`linear-gradient(to bottom, ${this.defaultStyles.colors.accent}, white)`);

        // Main border with double-line effect
        doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50)
           .lineWidth(3)
           .stroke(this.defaultStyles.colors.primary);
        
        doc.rect(35, 35, doc.page.width - 70, doc.page.height - 70)
           .lineWidth(1)
           .stroke(this.defaultStyles.colors.secondary);
    }

    private addDecorations(doc: PDFKit.PDFDocument): void {
        // Add corner flourishes
        this.addCornerFlourish(doc, 40, 40);
        this.addCornerFlourish(doc, doc.page.width - 40, 40, 90);
        this.addCornerFlourish(doc, 40, doc.page.height - 40, 270);
        this.addCornerFlourish(doc, doc.page.width - 40, doc.page.height - 40, 180);

        // Add decorative side borders
        this.addSideBorders(doc);
    }

    private addCornerFlourish(doc: PDFKit.PDFDocument, x: number, y: number, rotation: number = 0): void {
        doc.save()
           .translate(x, y)
           .rotate(rotation)
           .path('M 0,0 C 20,-20 40,-20 60,0 M 0,0 C -20,20 -20,40 0,60')
           .lineWidth(2)
           .stroke(this.defaultStyles.colors.secondary);
        doc.restore();
    }

    private addSideBorders(doc: PDFKit.PDFDocument): void {
        // Left and right decorative borders
        const pattern = 'M 0,0 C 10,20 -10,40 0,60';
        const repetitions = 7;
        const spacing = (doc.page.height - 120) / repetitions;

        for (let i = 0; i < repetitions; i++) {
            // Left border
            doc.save()
               .translate(50, 80 + i * spacing)
               .path(pattern)
               .lineWidth(1)
               .stroke(this.defaultStyles.colors.border);

            // Right border
            doc.save()
               .translate(doc.page.width - 50, 80 + i * spacing)
               .path(pattern)
               .lineWidth(1)
               .stroke(this.defaultStyles.colors.border);
            
            doc.restore();
        }
    }

    private addLogo(doc: PDFKit.PDFDocument): void {
        // Add decorative frame around logo
        const logoY = 60;
        doc.save()
           .translate(doc.page.width / 2, logoY)
           .path('M -100,-20 L 100,-20 L 100,20 L -100,20 Z')
           .lineWidth(2)
           .stroke(this.defaultStyles.colors.secondary);

        // Logo text with shadow effect
        doc.fontSize(28)
           .font(this.defaultStyles.fonts.title)
           .fillColor(this.defaultStyles.colors.primary)
           .text('DoWhile {Learn}', 0, logoY - 10, {
               align: 'center',
               width: doc.page.width
           });
    }

    private addContent(doc: PDFKit.PDFDocument, certificateData: ICertificateData): void {
        const centerY = doc.page.height / 2 - 30;

        // Title with decorative underline
        doc.fontSize(42)
           .font(this.defaultStyles.fonts.title)
           .fillColor(this.defaultStyles.colors.primary)
           .text('Certificate of Completion', 0, centerY - 100, {
               align: 'center',
               width: doc.page.width
           });

        // Decorative line under title
        const titleWidth = 400;
        doc.save()
           .translate((doc.page.width - titleWidth) / 2, centerY - 50)
           .path(`M 0,0 L ${titleWidth},0`)
           .lineWidth(3)
           .stroke(this.defaultStyles.colors.secondary);

        // Certificate content with improved spacing
        doc.fontSize(24)
           .font(this.defaultStyles.fonts.body)
           .fillColor(this.defaultStyles.colors.text)
           .text('This is to certify that', 0, centerY, {
               align: 'center',
               width: doc.page.width
           });

        // Student name with decorative elements
        doc.fontSize(32)
           .font(this.defaultStyles.fonts.title)
           .fillColor(this.defaultStyles.colors.primary)
           .text(certificateData.studentName, 0, centerY + 40, {
               align: 'center',
               width: doc.page.width
           });

        // Completion text
        doc.fontSize(18)
           .font(this.defaultStyles.fonts.body)
           .fillColor(this.defaultStyles.colors.text)
           .text('has successfully completed the course', 0, centerY + 90, {
               align: 'center',
               width: doc.page.width
           });

        // Course name with emphasis
        doc.fontSize(28)
           .font(this.defaultStyles.fonts.title)
           .fillColor(this.defaultStyles.colors.secondary)
           .text(certificateData.courseName, 0, centerY + 120, {
               align: 'center',
               width: doc.page.width
           });
    }

    private addFooter(doc: PDFKit.PDFDocument, certificateData: ICertificateData): void {
        const signatureY = doc.page.height - 150;

        // Signature section with improved layout
        doc.fontSize(14)
           .font(this.defaultStyles.fonts.body)
           .fillColor(this.defaultStyles.colors.text);

        // Date section
        doc.text(certificateData.completionDate, 150, signatureY + 20, {
            width: 200,
            align: 'center'
        });
        doc.text('Date', 150, signatureY + 40, {
            width: 200,
            align: 'center'
        });

        // Instructor section
        doc.text(certificateData.instructorName, doc.page.width - 350, signatureY + 20, {
            width: 200,
            align: 'center'
        });
        doc.text('Instructor', doc.page.width - 350, signatureY + 40, {
            width: 200,
            align: 'center'
        });

        // Enhanced signature lines
        this.drawSignatureLine(doc, 150, signatureY, 200);
        this.drawSignatureLine(doc, doc.page.width - 350, signatureY, 200);

        // Certificate ID with subtle styling
        doc.fontSize(10)
           .fillColor(this.defaultStyles.colors.border)
           .text(`Certificate ID: ${certificateData.certificateId}`, 50, doc.page.height - 40);
    }

    private drawSignatureLine(doc: PDFKit.PDFDocument, x: number, y: number, width: number): void {
        doc.save()
           .moveTo(x, y)
           .lineTo(x + width, y)
           .lineWidth(1)
           .stroke(this.defaultStyles.colors.primary)
           .restore();
    }
}