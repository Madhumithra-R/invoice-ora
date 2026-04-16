import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, Mail, Building2, User, Calendar, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const InvoicePreviewModal = ({ isOpen, invoice, onClose }) => {
  if (!isOpen || !invoice) return null;

  const invoiceNumber = `INV-2026-${invoice._id.substring(19, 24).toUpperCase()}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="bg-white rounded-[2.5rem] shadow-[0_20px_70px_rgba(0,0,0,0.3)] w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
                <Printer size={20} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Invoice Preview</h2>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-white rounded-full transition-all shadow-sm border border-slate-100">
              <X size={20} />
            </button>
          </div>

          {/* Invoice Body */}
          <div className="p-10 overflow-y-auto flex-1 font-sans">
            <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
               <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-[#c026d3] rounded-lg flex items-center justify-center text-white font-black">IN</div>
                    <span className="text-xl font-black text-slate-800 tracking-tighter">Invoiceora</span>
                  </div>
                  <div className="text-slate-500 font-bold text-sm space-y-1">
                    <p>123 Business Street</p>
                    <p>Creative Hub, NY 10001</p>
                    <p>billing@invoiceora.com</p>
                  </div>
               </div>
               <div className="text-right">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">INVOICE</h1>
                  <p className="text-brand font-black text-lg">{invoiceNumber}</p>
                  <div className="mt-4 text-slate-500 font-bold text-sm space-y-1">
                    <p>Issued: {new Date(invoice.date).toLocaleDateString()}</p>
                    <p>Due: {new Date(invoice.date).toLocaleDateString()}</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
               <div>
                  <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-3">BILL TO</p>
                  <div className="text-slate-800 flex flex-col gap-1">
                    <p className="text-xl font-black tracking-tight">{invoice.clientName}</p>
                    <p className="font-bold text-slate-500">Global Enterprises Inc.</p>
                    <p className="font-bold text-slate-500">client@example.com</p>
                  </div>
               </div>
               <div className="text-right flex flex-col items-end">
                  <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-3">PAYMENT STATUS</p>
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black border ${
                    invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-500 border-orange-100'
                  }`}>
                    {invoice.status.toUpperCase()}
                  </span>
               </div>
            </div>

            {/* Items Table */}
            <div className="mb-12">
               <table className="w-full">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 tracking-[0.2em] border-b border-slate-100">
                      <th className="text-left pb-4">DESCRIPTION</th>
                      <th className="text-center pb-4">QTY</th>
                      <th className="text-right pb-4">PRICE</th>
                      <th className="text-right pb-4 border-l border-transparent">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {invoice.items?.map((item, i) => (
                      <tr key={i}>
                        <td className="py-5 font-bold text-slate-800">{item.description}</td>
                        <td className="py-5 text-center font-bold text-slate-500">{item.quantity}</td>
                        <td className="py-5 text-right font-bold text-slate-500">${item.price.toFixed(2)}</td>
                        <td className="py-5 text-right font-black text-slate-800">${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>

            {/* Total Section */}
            <div className="flex justify-end pt-6 border-t border-slate-100">
               <div className="w-64 space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-slate-500 font-bold">Subtotal</span>
                    <span className="text-slate-800 font-bold">${invoice.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="text-slate-500 font-bold">Tax (0%)</span>
                    <span className="text-slate-800 font-bold">$0.00</span>
                  </div>
                  <div className="bg-slate-900 text-white p-5 rounded-2xl flex justify-between items-center shadow-2xl shadow-slate-200">
                    <span className="font-extrabold text-xs tracking-widest uppercase">Amount Due</span>
                    <span className="text-2xl font-black">${invoice.totalAmount.toFixed(2)}</span>
                  </div>
               </div>
            </div>

            <div className="mt-16 text-center">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Thank you for your business!</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
            <button onClick={() => toast.success("Invoice successfully emailed to the client!")} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-all text-sm">
               <Mail size={16} /> Send to Client
            </button>
            <div className="flex gap-3">
              <button 
                onClick={() => window.print()} 
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-800 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 text-sm"
              >
                <Download size={16} /> Download PDF
              </button>
              <button 
                onClick={() => window.print()} 
                className="px-6 py-2.5 bg-brand text-white font-bold rounded-xl shadow-[0_10px_30px_rgba(192,38,211,0.3)] hover:shadow-[0_15px_40px_rgba(192,38,211,0.5)] transition-all flex items-center gap-2 text-sm"
              >
                <Printer size={16} /> Print Invoice
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InvoicePreviewModal;
