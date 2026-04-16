import express from 'express';
import multer from 'multer';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice, parseInvoicePdf, getDashboardStats } from '../controllers/invoiceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/').get(protect, getInvoices).post(protect, createInvoice);
router.route('/:id').put(protect, updateInvoice).delete(protect, deleteInvoice);

router.post('/upload', protect, upload.single('invoicePdf'), parseInvoicePdf);
router.get('/stats/dashboard', protect, getDashboardStats);

export default router;
