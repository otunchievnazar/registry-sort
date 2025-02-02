"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
class PdfService {
    async convertPdfToText(file) {
        try {
            const data = await (0, pdf_parse_1.default)(file.buffer);
            return data.text;
        }
        catch (error) {
            console.error('Error parsing PDF:', error);
            throw new Error('Error parsing PDF');
        }
    }
    splitDocuments(text) {
        const headingText = "Основные сведения";
        const endingText = "Эксперты";
        const documents = [];
        const regex = new RegExp(`${headingText}([\\s\\S]*?)${endingText}`, 'g');
        let match;
        let registryId = 0;
        while ((match = regex.exec(text)) !== null) {
            const content = match[1].trim();
            registryId++;
            documents.push({
                id: registryId,
                content,
            });
        }
        return documents;
    }
}
exports.PdfService = PdfService;
