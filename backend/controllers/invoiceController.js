import Invoice from '../models/Invoice.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');


export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const { clientName, items, totalAmount, status, date } = req.body;
    const invoice = await Invoice.create({
      userId: req.user._id,
      clientName,
      items,
      totalAmount,
      status,
      date
    });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice || invoice.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice || invoice.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    await invoice.deleteOne();
    res.json({ message: 'Invoice removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const parseInvoicePdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }
    const data = await pdfParse(req.file.buffer);
    const text = data.text;
    
    // Simple regex parsing logic to mock AI parsing
    let totalAmount = 0;
    let vendorName = 'Unknown Vendor';
    let date = new Date().toISOString();

    const amountMatch = text.match(/(?:total|amount due)[\s:]*[\$€£]?\s*([\d,]+\.\d{2})/i);
    if (amountMatch) totalAmount = parseFloat(amountMatch[1].replace(/,/g, ''));

    const dateMatch = text.match(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/);
    if (dateMatch) date = dateMatch[0];

    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length > 0) vendorName = lines[0]; // Assuming first line might be vendor name

    res.json({
      vendorName,
      totalAmount,
      date,
      rawTextSummary: text.substring(0, 200) + '...'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error parsing PDF: ' + error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id });
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.totalAmount, 0);
    const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((acc, curr) => acc + curr.totalAmount, 0);
    res.json({
      totalInvoices: invoices.length,
      totalRevenue,
      pendingAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
