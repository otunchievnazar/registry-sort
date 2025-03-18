import express from "express";
import multer from "multer";
import path from "path";
import pdfRoutes from "./api/routes/pdfRoutes";
import dotenv from "dotenv";
import { PdfService } from "./api/services/pdfService";
import { OpenAIService } from "./api/services/openAIService";

dotenv.config();
const app = express();
const port = process.env.PORT || 3009;

const pdfService = new PdfService();
const openAIService = new OpenAIService();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only PDF files are allowed!'));
    }
  }
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>PDF Upload</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .upload-form {
            margin: 20px 0;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
          .result {
            margin-top: 20px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            display: none;
          }
          .error {
            color: red;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <h1>PDF Upload</h1>
        <div class="upload-form">
          <form id="uploadForm">
            <input type="file" name="pdf" accept=".pdf" required>
            <button type="submit">Upload PDF</button>
          </form>
          <div class="error" id="error"></div>
        </div>
        <div class="result" id="result">
          <h2>Results</h2>
          <pre id="output"></pre>
        </div>

        <script>
          document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const errorDiv = document.getElementById('error');
            const resultDiv = document.getElementById('result');
            const outputPre = document.getElementById('output');

            try {
              errorDiv.textContent = '';
              const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
              });

              if (!response.ok) {
                throw new Error('Upload failed');
              }

              const data = await response.json();
              resultDiv.style.display = 'block';
              outputPre.textContent = JSON.stringify(data, null, 2);
            } catch (error) {
              errorDiv.textContent = error.message;
              resultDiv.style.display = 'none';
            }
          });
        </script>
      </body>
    </html>
  `);
});

app.post("/api/upload", upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    // Use existing PDF processing pipeline
    const text = await pdfService.convertPdfToText(req.file);
    const documents = pdfService.splitDocuments(text);
    
    // Analyze the first document
    const firstDocument = documents[0];
    const analysis = await openAIService.analyzeText(firstDocument.content);

    res.json({
      message: 'File processed successfully',
      result: analysis
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(400).json({ error: errorMessage });
  }
});

app.use("/api", pdfRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;