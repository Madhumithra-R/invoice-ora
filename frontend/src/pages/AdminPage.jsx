import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download, Users, Shield, FileText, Building2, UserCircle, ArrowLeft, Search, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalInvoices: 0, totalClients: 0, paidRevenue: 0 });
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [users, setUsers] = useState(() => {
    const defaultUsers = [
      { id: 1, name: 'Admin User', email: 'admin@invoiceora.com', role: 'admin' },
      { id: 2, name: 'Guest User', email: 'guest@invoiceora.com', role: 'user' }
    ];
    const currentUserStr = localStorage.getItem('user');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      // Avoid duplicates
      if (!defaultUsers.some(u => u.email === currentUser.email)) {
        defaultUsers.push({ id: Date.now(), ...currentUser, role: 'user' });
      }
    }
    return defaultUsers;
  });

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const fetchInvoiceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/invoices', { headers: { Authorization: `Bearer ${token}` } });
      const data = res.data;
      
      const uniqueClients = new Set(data.map(i => i.clientName)).size;
      const paid = data.filter(i => i.status === 'paid').reduce((a, b) => a + b.totalAmount, 0);

      setStats({
        totalInvoices: data.length,
        totalClients: uniqueClients,
        paidRevenue: paid
      });
      setInvoices(data);
    } catch (error) {}
  };

  const exportUsers = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Email,Role\n" 
      + users.map(u => `${u.name},${u.email},${u.role}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    toast.success("Users exported!");
  };

  const exportInvoices = () => {
    if(!invoices.length) return toast.error("No invoices to export");
    const csvContent = "data:text/csv;charset=utf-8,ID,Client,Date,Amount,Status\n" 
      + invoices.map(i => `${i._id},${i.clientName},${new Date(i.date).toLocaleDateString()},${i.totalAmount},${i.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invoices_export.csv");
    document.body.appendChild(link);
    link.click();
    toast.success("Invoices exported!");
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto px-4 pb-20"
    >
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[10px] font-black tracking-[0.2em] uppercase transition-all mb-4 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO DASHBOARD
      </button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
             <Shield size={24} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Admin Panel</h1>
            <p className="text-slate-400 font-bold text-sm mt-1">Manage users and oversee the entire system.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={exportUsers} className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm hover:shadow-md transition-all font-semibold text-xs">
            <Download size={16} /> Export Users
          </button>
          <button onClick={exportInvoices} className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm hover:shadow-md transition-all font-semibold text-xs">
            <Download size={16} /> Export Invoices
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <AdminCard index={0} value={users.length} label="Total Users" icon={<Users size={22} />} iconBg="bg-fuchsia-500" />
        <AdminCard index={1} value={users.filter(u=>u.role==='admin').length} label="Admin Users" icon={<Shield size={22} />} iconBg="bg-orange-500" />
        <AdminCard index={2} value={stats.totalInvoices} label="Total Invoices" icon={<FileText size={22} />} iconBg="bg-blue-500" />
        <AdminCard index={3} value={stats.totalClients} label="Total Clients" icon={<Building2 size={22} />} iconBg="bg-emerald-500" />
        <AdminCard index={4} value={`$${stats.paidRevenue.toLocaleString()}`} label="Paid Revenue" icon={<Activity size={22} />} iconBg="bg-brand" />
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-6 border-b border-slate-50 gap-4">
           <div className="flex flex-col gap-1">
              <p className="text-[10px] font-black text-slate-400 tracking-[0.15em] uppercase">Control Center</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">User Management</h2>
           </div>
           
           <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users..." className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all shadow-sm" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="text-xs uppercase font-extrabold tracking-[0.1em] text-slate-500 border-b border-slate-200 bg-slate-100/50">
              <th className="px-8 py-4">NAME</th>
              <th className="px-8 py-4">EMAIL</th>
              <th className="px-8 py-4">ROLE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
             {filteredUsers.map(user => (
               <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${user.role === 'admin' ? 'bg-fuchsia-500' : 'bg-slate-700'}`}>
                        {user.name.charAt(0).toUpperCase()}
                     </div>
                     <span className="font-bold text-slate-800 text-sm">{user.name}</span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-sm text-slate-400 font-medium">{user.email}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${uRoleUI(user.role).styles}`}>
                      {uRoleUI(user.role).icon}
                      {user.role}
                    </span>
                  </td>
               </tr>
             ))}
             {filteredUsers.length === 0 && <tr><td colSpan="3" className="text-center py-8 text-slate-400 font-medium">No users found.</td></tr>}
          </tbody>
        </table>
      </div>
      </div>
    </motion.div>
  );
};

const AdminCard = ({ label, value, icon, iconBg, index }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5, scale: 1.02 }} 
    className="bg-white rounded-[2rem] p-7 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-start gap-4 transition-all duration-300 group overflow-hidden relative"
  >
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity ${iconBg}`}></div>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg} text-white shadow-xl group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <h3 className="text-2xl font-black text-slate-900 leading-none mb-1.5 tracking-tighter">{value}</h3>
      <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">{label}</p>
    </div>
  </motion.div>
);

const uRoleUI = (role) => {
  if(role === 'admin') return {
    styles: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
  };
  return {
    styles: 'bg-slate-100 text-slate-500 border-slate-200',
    icon: <UserCircle size={14} />
  };
}

export default AdminPage;
