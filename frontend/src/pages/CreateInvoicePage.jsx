import React, { useState } from 'react';
import { ArrowLeft, FileText, Plus, Sparkles, Trash2, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateInvoicePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'pending',
    taxRate: 0,
    notes: 'Payment due within 30 days. Thank you for your business!',
    items: [{ description: '', quantity: 1, price: 0 }]
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = () => formData.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
  const subtotal = calculateSubtotal();
  const tax = subtotal * (Number(formData.taxRate) / 100);
  const total = subtotal + tax;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('invoicePdf', file);
    setIsUploading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/invoices/upload', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { vendorName, totalAmount, date } = res.data;
      
      setFormData(prev => ({
        ...prev,
        clientName: vendorName || prev.clientName,
        date: date ? new Date(date).toISOString().split('T')[0] : prev.date,
        items: [{ description: 'AI Parsed Items', quantity: 1, price: totalAmount || 0 }]
      }));
      toast.success('PDF parsed successfully! Form fields updated.');
    } catch (error) {
      toast.error('Failed to parse PDF.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/invoices', {
        ...formData,
        totalAmount: total
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Invoice created successfully!');
      navigate('/dashboard/invoices');
    } catch (error) {
      toast.error('Failed to create invoice');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 animate-in fade-in">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors">
          <ArrowLeft size={18} /> Back
        </button>
      </div>
      <div className="mb-8 flex justify-between items-end">
        <div>
           <p className="text-slate-400 font-black text-[10px] tracking-[0.2em] uppercase mb-2">Transaction</p>
           <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">New Invoice</h1>
           <p className="text-slate-400 font-bold text-sm mt-1">Issue a professional document in seconds.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Block 1: Details */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-md shadow-brand/30">
               <FileText size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Invoice Details</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2 flex items-center gap-1">
                <UsersIcon /> CLIENT RECORD *
              </label>
              <input required name="clientName" placeholder="Enter client name..." value={formData.clientName} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border-transparent rounded-[1.2rem] outline-none focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand/20 font-bold transition-all text-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2 flex items-center gap-1">
                  <CalendarIcon /> ISSUE DATE *
                </label>
                <input required type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 outline-none transition-all font-medium text-sm text-slate-600" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2 flex items-center gap-1">
                  <CalendarIcon /> DUE DATE *
                </label>
                <input required type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 outline-none transition-all font-medium text-sm text-slate-600" />
              </div>
            </div>

            <div className="w-1/3">
              <label className="block text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-1">Tax Rate (%)</label>
              <input type="number" min="0" name="taxRate" value={formData.taxRate} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 outline-none transition-all font-medium text-sm" />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2">Notes / Payment Terms</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 outline-none transition-all font-medium text-sm resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Block 2: Line Items */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-md shadow-brand/30">
                  <Calculator size={20} />
               </div>
               <h2 className="text-lg font-bold text-slate-900">Line Items</h2>
             </div>
             <button type="button" onClick={() => setFormData({...formData, items: [...formData.items, {description: '', quantity: 1, price: 0}]})} className="text-brand font-bold text-sm flex items-center gap-2 py-2 px-4 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
               <Plus size={16} /> Add Item
             </button>
          </div>

          <div className="space-y-4">
             <div className="flex gap-4 px-2">
               <div className="flex-1 text-[11px] font-extrabold text-slate-400 tracking-wider">DESCRIPTION</div>
               <div className="w-24 text-[11px] font-extrabold text-slate-400 tracking-wider text-center">QTY</div>
               <div className="w-32 text-[11px] font-extrabold text-slate-400 tracking-wider text-center">UNIT PRICE</div>
               <div className="w-8"></div>
             </div>

             {formData.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                   <div className="flex-1">
                     <input required placeholder="Service description..." value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 outline-none font-medium text-sm" />
                   </div>
                   <div className="w-24">
                     <input required type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 outline-none font-medium text-sm text-center" />
                   </div>
                   <div className="w-32">
                     <input required type="number" min="0" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 outline-none font-medium text-sm text-right" />
                   </div>
                   <div className="w-8 flex justify-center">
                      <button type="button" onClick={() => {
                        const newItems = formData.items.filter((_, i) => i !== index);
                        setFormData({ ...formData, items: newItems.length ? newItems : [{description: '', quantity: 1, price: 0}] });
                      }} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                   </div>
                </div>
             ))}
          </div>

          <div className="mt-8 flex justify-end">
             <div className="w-72 bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
               <div className="flex justify-between items-center mb-3">
                 <span className="text-slate-500 font-bold text-sm">Subtotal</span>
                 <span className="text-slate-800 font-bold text-sm">${subtotal.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center mb-5">
                 <span className="text-slate-500 font-bold text-sm">Tax ({formData.taxRate || 0}%)</span>
                 <span className="text-slate-800 font-bold text-sm">${tax.toFixed(2)}</span>
               </div>
               <div className="bg-brand text-white p-4 rounded-xl flex justify-between items-center shadow-lg shadow-brand/30">
                 <div className="flex items-center gap-2 font-bold text-sm">
                   <Calculator size={18} /> Total
                 </div>
                 <span className="font-extrabold text-xl">${total.toFixed(2)}</span>
               </div>
             </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 py-6">
           <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 transition-colors shadow-sm">
             Cancel
           </button>
           <button type="submit" className="px-6 py-3 bg-brand text-white font-bold rounded-full shadow-lg hover:shadow-brand/30 transition-shadow flex items-center gap-2">
             <Sparkles size={18} /> Create Invoice
           </button>
        </div>
      </form>
    </div>
  );
};

const UsersIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-brand"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CalendarIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-brand"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;

export default CreateInvoicePage;
