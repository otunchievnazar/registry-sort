import pdfParse from 'pdf-parse';

export class PdfService {
  async convertPdfToText(file: Express.Multer.File): Promise<string> {
    try {
      const data = await pdfParse(file.buffer);
      return data.text;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Error parsing PDF');
    }
  }

  splitDocuments(text: string): Array<{ id: number; content: string }> {
    const headingText = "Основные сведения";
    const endingText = "Эксперты";
    const documents: Array<{ id: number; content: string }> = [];

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