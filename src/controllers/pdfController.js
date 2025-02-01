const PdfService = require('../services/pdfService');

class PdfController {
  constructor() {
    this.pdfService = new PdfService();
  }

  async uploadPdf(req, res) {
    try {
      const file = req.file;

      if (!file) {
        res.status(400).send('No file uploaded');
        return;
      }

      const text = await this.pdfService.convertPdfToText(file);
      res.status(200).send(text);
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).send('Error processing file');
    }
  }
}

module.exports = PdfController;