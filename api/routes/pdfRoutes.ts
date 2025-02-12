import { Router, Request, Response } from 'express';
import multer from 'multer';
import PdfController from '../controllers/pdfController';

const router = Router();
const upload = multer();
const pdfController = new PdfController();

router.post('/upload', upload.single('pdf'), (req: Request, res: Response) => pdfController.uploadPdf(req, res));

export default router;