"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const pdfService_1 = require("../services/pdfService");
const openAIService_1 = require("../services/openAIService");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadSchema = zod_1.z.object({
    pdf: zod_1.z.instanceof(Buffer),
});
class PdfController {
    pdfService;
    openAIService;
    constructor() {
        this.pdfService = new pdfService_1.PdfService();
        this.openAIService = new openAIService_1.OpenAIService();
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
            // Analyze only the first section
            const firstDocument = documents[0];
            const analysis = await this.openAIService.analyzeText(firstDocument.content);
            const analyzedDocument = {
                id: firstDocument.id,
                analysis,
            };
            // Save the analyzed document to a JSON file in the root directory
            const outputPath = path_1.default.join(__dirname, '../../analyzed_document.json');
            fs_1.default.writeFileSync(outputPath, JSON.stringify(analyzedDocument, null, 2));
            console.log(analyzedDocument);
            res.status(200).json(analyzedDocument);
        }
        catch (error) {
            console.error('Error processing file:', error);
            res.status(500).send('Error processing file');
        }
    }
}
exports.default = PdfController;
