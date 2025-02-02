import { Request, Response } from 'express';
import { z } from 'zod';
import { PdfService } from '../services/pdfService';

const uploadSchema = z.object({
  pdf: z.instanceof(Buffer),
});

export default class PdfController {
  private pdfService: PdfService;

  constructor() {
    this.pdfService = new PdfService();
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

      console.log(documents);
      res.status(200).json(documents);
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).send('Error processing file');
    }
  }
}