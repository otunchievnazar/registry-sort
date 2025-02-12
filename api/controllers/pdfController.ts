import { Request, Response } from 'express';
import { z } from 'zod';
import { PdfService } from '../services/pdfService';
import { OpenAIService } from '../services/openAIService';
import fs from 'fs';
import path from 'path';

const uploadSchema = z.object({
  pdf: z.instanceof(Buffer),
});

export default class PdfController {
  private pdfService: PdfService;
  private openAIService: OpenAIService;

  constructor() {
    this.pdfService = new PdfService();
    this.openAIService = new OpenAIService();
  }

  async uploadPdf(req: Request, res: Response): Promise<void> {
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

      console.log(documents[0], 'XXXXXXXXX');

      // Analyze only the first section
      const firstDocument = documents[0];
      const analysis = await this.openAIService.analyzeText(firstDocument.content);

      const analyzedDocument = {
        id: firstDocument.id,
        analysis,
      };

      // Save the analyzed document to a JSON file in the root directory
      const outputPath = path.join(__dirname, '../../analyzed_document.json');
      fs.writeFileSync(outputPath, JSON.stringify(analyzedDocument, null, 2));

      console.log(analyzedDocument);
      res.status(200).json(analyzedDocument);
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).send('Error processing file');
    }
  }
}