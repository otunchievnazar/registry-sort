"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const pdfController_1 = __importDefault(require("../controllers/pdfController"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
const pdfController = new pdfController_1.default();
router.post('/upload', upload.single('pdf'), (req, res) => pdfController.uploadPdf(req, res));
exports.default = router;
