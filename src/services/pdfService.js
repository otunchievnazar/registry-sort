const pdfParse = require('pdf-parse');

class PdfService {
  async convertPdfToText(file) {
    const data = await pdfParse(file.buffer);
    return data.text;
  }
}

module.exports = PdfService;