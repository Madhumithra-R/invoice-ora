import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { FileText, MoreHorizontal, CheckCircle2, Clock, AlertCircle, Edit, Trash2, Eye, Filter, Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import InvoicePreviewModal from '../components/InvoicePreviewModal';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'All';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/invoices', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoices(res.data);
    } catch (e) { toast.error("Failed to fetch"); } finally { setLoading(false); }
  };

  const deleteInvoice = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/invoices/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Deleted!");
      fetchInvoices();
      setOpenDropdown(null);
    } catch (e) {}
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/invoices/${id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Marked as ${newStatus}!`);
      fetchInvoices();
      setOpenDropdown(null);
    } catch(e) {
      toast.error("Status update failed");
    }
  };

  const handleViewInvoice = (inv) => {
    setSelectedInvoice(inv);
    setIsPreviewOpen(true);
    setOpenDropdown(null);
  }

  const exportCSV = () => {
    if(!invoices.length) return toast.error("No invoices to export");
    const csvContent = "data:text/csv;charset=utf-8,ID,ClientName,Date,TotalAmount,Status\n" 
      + invoices.map(i => `${i._id},${i.clientName},${new Date(i.date).toLocaleDateString()},${i.totalAmount},${i.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invoices_export.csv");
    document.body.appendChild(link);
    link.click();
    toast.success("Invoices exported successfully!");
  };

  if (loading) return null;

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = (inv.clientName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || (inv._id || '').includes(searchTerm);
    const matchesTab = activeTab === 'All' ? true : (inv.status || '').toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto px-4 pb-20"
    >
      <InvoicePreviewModal 
        isOpen={isPreviewOpen} 
        invoice={selectedInvoice} 
        onClose={() => setIsPreviewOpen(false)} 
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
             <FileText size={24} />
          </div>
          <div>
            <p className="text-slate-400 font-black text-[10px] tracking-[0.2em] uppercase mb-1">Financial Records</p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Invoices</h1>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
           {['All', 'Paid', 'Pending', 'Overdue'].map((tab) => (
             <button 
               onClick={() => setActiveTab(tab)} 
               key={tab} 
               className={`px-5 py-2 text-xs font-black rounded-xl transition-all ${activeTab===tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
               {tab.toUpperCase()}
             </button>
           ))}
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="hidden md:flex items-center gap-2 bg-slate-900 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg hover:shadow-slate-300 transition-all hover:-translate-y-0.5">
            <FileText size={16} /> EXPORT CSV
          </button>
          <button onClick={() => window.location.href = '/dashboard/invoices/new'} className="flex items-center gap-2 bg-brand text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg hover:shadow-brand/30 transition-all hover:-translate-y-0.5">
            <Plus size={16} /> NEW INVOICE
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100/50 pb-12">
        <div className="flex flex-col md:flex-row items-center justify-between p-6 px-8 border-b border-slate-50 gap-4">
          <div className="flex relative w-full max-w-md group">
            <Search size={18} className="text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-brand transition-colors" />
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search invoices..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-[1.2rem] text-sm font-bold focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand/20 outline-none transition-all placeholder:text-slate-300" 
            />
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-400">
             <Filter size={16} />
             <span className="text-xs font-black tracking-widest uppercase">Sorted by Date</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-48">
          <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-xs uppercase font-extrabold tracking-[0.1em] text-slate-400 border-b border-slate-100">
              <th className="px-8 py-5">INVOICE</th>
              <th className="px-8 py-5">CLIENT</th>
              <th className="px-8 py-5">AMOUNT</th>
              <th className="px-8 py-5">STATUS</th>
              <th className="px-8 py-5 text-right tracking-normal">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredInvoices.length === 0 && (
              <tr><td colSpan="5" className="text-center py-12 text-slate-400 font-medium">No invoices found matching your criteria.</td></tr>
            )}
            {filteredInvoices.map((inv, idx) => (
              <motion.tr 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={inv._id} 
                className="hover:bg-slate-50/50 transition-all group cursor-default"
              >
                <td className="px-8 py-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 group-hover:bg-white group-hover:shadow-md text-slate-400 group-hover:text-brand rounded-2xl flex items-center justify-center flex-shrink-0 transition-all">
                    <FileText size={22} className="opacity-50" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-[13px] tracking-tight uppercase group-hover:text-brand transition-colors">#{inv._id?.slice(-5)}</h4>
                    <p className="text-[11px] text-slate-400 font-bold mt-0.5">{new Date(inv.date).toLocaleDateString()}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="font-black text-slate-900 text-[13px] tracking-tight">{inv.clientName}</p>
                  <p className="text-[11px] text-slate-400 font-bold lowercase tracking-wide">{(inv.clientName || 'unknown').replace(/\s+/g,'')}@enterprise.com</p>
                </td>
                <td className="px-8 py-6 font-black text-slate-900 text-sm">
                  ${inv.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                    inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-orange-50 text-orange-600 border-orange-100/50'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${inv.status === 'paid' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                    {inv.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right relative">
                  <div className="flex justify-end gap-2 transition-all">
                    <button onClick={() => handleViewInvoice(inv)} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-[11px] transition-all hover:bg-black shadow-lg">
                      <Eye size={14} /> VIEW
                    </button>
                    <div className="relative">
                      <button onClick={() => setOpenDropdown(openDropdown === inv._id ? null : inv._id)} className="w-9 h-9 flex items-center justify-center bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all font-bold">
                        <MoreHorizontal size={16} />
                      </button>
                      {openDropdown === inv._id && (
                        <div className="absolute right-0 top-full mt-2 bg-white shadow-[0_15px_50px_rgba(0,0,0,0.15)] border border-slate-100 rounded-2xl w-48 z-[100] py-3 text-[11px] font-black flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="px-4 py-2 text-slate-400 text-[9px] uppercase tracking-widest border-b border-slate-50 mb-1">Actions</div>
                          <button onClick={() => updateStatus(inv._id, 'paid')} className="flex items-center gap-3 px-5 py-2.5 hover:bg-emerald-50 text-emerald-600 text-left w-full transition-colors"><CheckCircle2 size={14}/> MARK PAID</button>
                          <button onClick={() => updateStatus(inv._id, 'overdue')} className="flex items-center gap-3 px-5 py-2.5 hover:bg-red-50 text-red-600 text-left w-full transition-colors"><AlertCircle size={14}/> MARK OVERDUE</button>
                          <button onClick={() => updateStatus(inv._id, 'pending')} className="flex items-center gap-3 px-5 py-2.5 hover:bg-orange-50 text-orange-600 text-left w-full transition-colors"><Clock size={14}/> MARK PENDING</button>
                          <div className="h-px bg-slate-50 my-2 w-full" />
                          <button onClick={() => deleteInvoice(inv._id)} className="flex items-center gap-3 px-5 py-2.5 hover:bg-red-50 text-red-500 text-left w-full transition-colors"><Trash2 size={14}/> DELETE RECORD</button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </motion.div>
  );
};

export default InvoicesPage;
