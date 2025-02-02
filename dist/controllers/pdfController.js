"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const pdfService_1 = require("../services/pdfService");
const uploadSchema = zod_1.z.object({
    pdf: zod_1.z.instanceof(Buffer),
});
class PdfController {
    pdfService;
    constructor() {
        this.pdfService = new pdfService_1.PdfService();
    }
    async uploadPdf(req, res) {
        try {
            const file = req.file;
            if (!file) {
                res.status(400).send('No file uploaded');
                return;
            }
            const validationResult = uploadSchema.safeParse({ pdf: file.buffer });
            if (!validationResult.success) {
                res.status(400).send('Invalid file uploaded');
                return;
            }
            const text = await this.pdfService.convertPdfToText(file);
            const documents = this.pdfService.splitDocuments(text);
            console.log(documents);
            res.status(200).json(documents);
        }
        catch (error) {
            console.error('Error processing file:', error);
            res.status(500).send('Error processing file');
        }
    }
}
exports.default = PdfController;
