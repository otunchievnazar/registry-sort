import pdfParse from "pdf-parse";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export class PdfService {
   loader = (file: Express.Multer.File) => new DirectoryLoader("./documents", {
    ".txt": (path) => new TextLoader(path),
    ".pdf": (path) => {
      // Create a blob from the file buffer
      const blob = new Blob([file.buffer], { type: 'application/pdf' });
      return new PDFLoader(blob);
    },
  });

  async convertPdfToText(file: Express.Multer.File): Promise<string> {
    try {
      const blob = new Blob([file.buffer], { type: 'application/pdf' });
      const loader = new PDFLoader(blob);
      const docs = await loader.load();

      return docs.map(doc => doc.pageContent).join('\n');
    } catch (error) {
      console.error("Error parsing PDF:", error);
      throw new Error("Error parsing PDF");
    }
  }

  splitDocuments(text: string): Array<{ id: number; content: string }> {
    const headingText = "Основные сведения";
    const endingText = "Эксперты";
    const documents: Array<{ id: number; content: string }> = [];

    const regex = new RegExp(`${headingText}([\\s\\S]*?)${endingText}`, "g");
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
