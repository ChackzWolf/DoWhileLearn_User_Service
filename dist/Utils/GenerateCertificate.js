"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateGenerator = void 0;
var pdfkit_1 = __importDefault(require("pdfkit"));
var CertificateGenerator = /** @class */ (function () {
    function CertificateGenerator() {
        this.defaultStyles = {
            pageSize: [842, 595], // A4 Landscape
            margins: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            },
            colors: {
                primary: '#663399', // Deep violet
                secondary: '#8B7AA8', // Muted violet
                text: '#2D2438', // Dark violet
                border: '#E0D5F5' // Light violet
            },
            fonts: {
                title: 'Helvetica-Bold',
                body: 'Helvetica'
            }
        };
    }
    CertificateGenerator.prototype.generateCertificate = function (certificateData) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            var chunks_1 = [];
                            var doc = new pdfkit_1.default({
                                size: _this.defaultStyles.pageSize,
                                margins: _this.defaultStyles.margins,
                                bufferPages: true
                            });
                            doc.on('data', function (chunk) { return chunks_1.push(chunk); });
                            doc.on('end', function () { return resolve(Buffer.concat(chunks_1)); });
                            doc.on('error', reject);
                            _this.addBorders(doc);
                            _this.addLogo(doc);
                            _this.addContent(doc, certificateData);
                            _this.addFooter(doc, certificateData);
                            doc.end();
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    CertificateGenerator.prototype.addBorders = function (doc) {
        // Elegant double border
        var outerMargin = 40;
        var innerMargin = 60;
        // Outer border
        doc.rect(outerMargin, outerMargin, doc.page.width - (outerMargin * 2), doc.page.height - (outerMargin * 2))
            .lineWidth(2)
            .stroke(this.defaultStyles.colors.primary);
        // Inner border
        doc.rect(innerMargin, innerMargin, doc.page.width - (innerMargin * 2), doc.page.height - (innerMargin * 2))
            .lineWidth(1)
            .stroke(this.defaultStyles.colors.border);
    };
    CertificateGenerator.prototype.addLogo = function (doc) {
        var logoY = 90;
        // Simple, elegant logo presentation
        doc.fontSize(32)
            .font(this.defaultStyles.fonts.title)
            .fillColor(this.defaultStyles.colors.primary)
            .text('DoWhile {Learn}', 0, logoY, {
            align: 'center',
            width: doc.page.width
        });
        // Subtle underline
        var lineWidth = 200;
        var lineY = logoY + 45;
        doc.moveTo((doc.page.width - lineWidth) / 2, lineY)
            .lineTo((doc.page.width + lineWidth) / 2, lineY)
            .lineWidth(1)
            .stroke(this.defaultStyles.colors.border);
    };
    CertificateGenerator.prototype.addContent = function (doc, certificateData) {
        var centerY = doc.page.height / 2 - 30;
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
    };
    CertificateGenerator.prototype.addFooter = function (doc, certificateData) {
        var signatureY = doc.page.height - 150;
        // Signature lines with labels
        this.addSignatureLine(doc, 'Date', certificateData.completionDate, 150, signatureY);
        this.addSignatureLine(doc, 'Instructor', certificateData.instructorName, doc.page.width - 350, signatureY);
        // Certificate ID with subtle styling
        doc.fontSize(10)
            .fillColor(this.defaultStyles.colors.secondary)
            .text("Certificate ID: ".concat(certificateData.certificateId), 70, doc.page.height - 70);
    };
    CertificateGenerator.prototype.addSignatureLine = function (doc, label, value, x, y) {
        var lineWidth = 200;
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
    };
    return CertificateGenerator;
}());
exports.CertificateGenerator = CertificateGenerator;
