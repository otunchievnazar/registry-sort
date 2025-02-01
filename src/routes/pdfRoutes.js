const express = require('express');
const multer = require('multer');
const PdfController = require('../controllers/pdfController');

const router = express.Router();
const upload = multer();
const pdfController = new PdfController();

router.post('/upload', upload.single('pdf'), (req, res) => pdfController.uploadPdf(req, res));

module.exports = router;