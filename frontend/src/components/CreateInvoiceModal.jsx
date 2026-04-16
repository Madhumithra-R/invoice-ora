import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateInvoiceModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    items: [{ description: '', quantity: 1, price: 0 }]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        totalAmount: calculateTotal()
      };
      
      await axios.post('http://localhost:5000/api/invoices', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Invoice created successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="bg-white rounded-[2.5rem] shadow-[0_20px_70px_rgba(0,0,0,0.3)] w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-slate-50">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Quick Invoice</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Fill in the details to generate an invoice fast.</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8 overflow-y-auto flex-1">
            <form id="invoice-form" onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Client Name</label>
                  <input required name="clientName" value={formData.clientName} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all" placeholder="e.g. Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                  <input type="date" required name="date" value={formData.date} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full md:w-1/3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {/* Line Items */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Line Items</h3>
                  <button type="button" onClick={addItem} className="text-sm flex items-center gap-1 text-brand font-medium hover:underline">
                    <Plus size={16} /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input required placeholder="Item description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand outline-none" />
                      </div>
                      <div className="w-24">
                        <input required type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand outline-none" />
                      </div>
                      <div className="w-32">
                        <input required type="number" min="0" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand outline-none" />
                      </div>
                      {formData.items.length > 1 && (
                        <button type="button" onClick={() => removeItem(index)} className="p-2.5 mt-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-slate-800">${calculateTotal().toFixed(2)}</p>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
            <button onClick={onClose} className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button form="invoice-form" type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-brand text-white font-medium rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all flex items-center gap-2">
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              Save Invoice
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateInvoiceModal;
