import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Plus, Users, Clock, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CreateInvoiceModal from '../components/CreateInvoiceModal';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalInvoices: 0, totalRevenue: 0, pendingAmount: 0 });
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const statsRes = await axios.get('http://localhost:5000/api/invoices/stats/dashboard', config);
      setStats(statsRes.data);
      const invRes = await axios.get('http://localhost:5000/api/invoices', config);
      setInvoices(invRes.data);
    } catch (e) {}
  };

  const chartData = [
    { name: 'May', val: 0 }, { name: 'Jun', val: 0 }, { name: 'Jul', val: 0 },
    { name: 'Aug', val: 0 }, { name: 'Sep', val: 0 }, { name: 'Oct', val: 0 },
    { name: 'Nov', val: 0 }, { name: 'Dec', val: 0 }, { name: 'Jan', val: 0 },
    { name: 'Feb', val: 0 }, { name: 'Mar', val: 0 }, { name: 'Apr', val: 0 }
  ];

  // Dynamically populate chartData from invoices
  invoices.forEach(inv => {
    const date = new Date(inv.date);
    const mIdx = date.getMonth(); // 0 is Jan, 11 is Dec
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const idx = chartData.findIndex(c => c.name === monthNames[mIdx]);
    if(idx !== -1) chartData[idx].val += inv.totalAmount;
  });

  // Pie Chart Data
  const paidCount = invoices.filter(i => i.status === 'paid').length;
  const pendingCount = invoices.filter(i => i.status === 'pending').length;
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;
  
  const pieData = [
    { name: 'Paid', value: paidCount, color: '#10b981' },
    { name: 'Pending', value: pendingCount, color: '#f97316' },
    { name: 'Overdue', value: overdueCount, color: '#ef4444' }
  ].filter(d => d.value > 0);
  
  // Fallback for empty state pie chart
  if (pieData.length === 0) pieData.push({ name: 'No Data', value: 1, color: '#e2e8f0' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto px-4 pb-20"
    >
      <CreateInvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pt-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
             <Sparkles size={24} />
          </div>
          <div>
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 font-black text-[10px] tracking-[0.2em] flex items-center gap-2 uppercase mb-1"
            >
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              Operational Status: <span className="text-brand">Active</span>
            </motion.p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-600">Admin</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Top 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard label="TOTAL REVENUE" amount={`$${stats.totalRevenue.toLocaleString()}`} subtitle={`${stats.totalInvoices} invoices total`} iconColor="bg-fuchsia-500 shadow-fuchsia-200" textIcon="$" />
        <StatCard label="PAID" amount={`$${(stats.totalRevenue).toLocaleString()}`} subtitle={`${invoices.filter(i=>i.status==='paid').length} paid invoices`} iconColor="bg-[#10b981] shadow-emerald-200" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>} />
        <StatCard label="PENDING" amount={`$${stats.pendingAmount.toLocaleString()}`} subtitle={`${invoices.filter(i=>i.status==='pending').length} awaiting payment`} iconColor="bg-orange-500 shadow-orange-200" icon={<Clock size={20} className="text-white" />} />
        <StatCard label="OVERDUE" amount={"$2,200"} subtitle="1 need attention" iconColor="bg-red-600 shadow-red-200" icon={<AlertCircle size={20} className="text-white" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Revenue Overview</h2>
              <p className="text-xs text-slate-400 font-bold">Monthly revenue trend</p>
            </div>
            <div className="bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-slate-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              12 months
            </div>
          </div>
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c026d3" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#c026d3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  cursor={{stroke: '#cbd5e1', strokeWidth: 1}}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                          <p className="text-slate-500 text-xs font-semibold mb-1">{label} 2026</p>
                          <p className="text-brand font-extrabold text-sm">${payload[0].value.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="val" stroke="#c026d3" strokeWidth={3} fillOpacity={1} fill="url(#gradientColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Paid vs Pending */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col h-full">
           <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Invoice Status</h2>
              <p className="text-sm text-slate-400 font-medium">Paid vs Pending</p>
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length && payload[0].name !== 'No Data') {
                      return (
                        <div className="bg-slate-900 text-white p-2 px-3 rounded-xl shadow-xl text-xs font-bold font-sans">
                          {payload[0].name}: {payload[0].value}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text for Pie */}
            {invoices.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-800 leading-none">{invoices.length}</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">Total</span>
              </div>
            )}
            {invoices.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 font-bold text-sm">
                No Invoices
              </div>
            )}
          </div>
          
          {/* Legend */}
          {invoices.length > 0 && (
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: d.color}}></div>
                  <span className="text-xs font-bold text-slate-600">{d.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Invoices List */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-black text-slate-400 tracking-[0.15em] uppercase leading-none">Activity Hub</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Recent Invoices</h2>
            </div>
            <button onClick={() => navigate('/dashboard/invoices')} className="text-brand text-xs font-bold flex items-center gap-1 hover:underline">
              View all <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
          <div className="flex-1 space-y-4">
            {invoices.slice(0, 4).map(inv => (
              <div key={inv._id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-brand">
                    <FileText size={18} />
                  </div>
                  <div>
                     <p className="font-bold text-slate-900 text-sm">{inv.clientName}</p>
                     <p className="text-xs text-slate-400 font-medium">INV-2026-{(inv._id || '').slice(-5).toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-sm">${inv.totalAmount.toLocaleString()}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                    inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-500'
                  }`}>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
            {invoices.length === 0 && <p className="text-sm text-slate-400 text-center py-10 font-medium">No recent invoices</p>}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <p className="text-xs font-bold text-slate-400 mb-4 tracking-widest pl-2">QUICK ACTIONS</p>
        <div className="flex gap-4 overflow-x-auto pb-4">
          <QuickActionBtn onClick={() => navigate('/dashboard/invoices/new')} icon={<Plus size={16}/>} text="New Invoice" bg="border-fuchsia-100 hover:border-fuchsia-300" iconBg="bg-[#d946ef] text-white shadow-fuchsia-200" />
          <QuickActionBtn onClick={() => navigate('/dashboard/clients')} icon={<Users size={16}/>} text="Add Client" bg="border-pink-100 hover:border-pink-300" iconBg="bg-[#ec4899] text-white shadow-pink-200" />
          <QuickActionBtn onClick={() => navigate('/dashboard/invoices?tab=Overdue')} icon={<AlertCircle size={16}/>} text="Overdue List" bg="border-red-100 hover:border-red-300" iconBg="bg-[#ef4444] text-white shadow-red-200" />
          <QuickActionBtn onClick={() => navigate('/dashboard/invoices?tab=Pending')} icon={<Clock size={16}/>} text="Pending List" bg="border-orange-100 hover:border-orange-300" iconBg="bg-[#f97316] text-white shadow-orange-200" />
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ label, amount, subtitle, iconColor, icon, textIcon }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }} 
    className="bg-white rounded-[2rem] p-7 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col relative overflow-hidden group transition-all"
  >
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-brand/5 transition-colors duration-500"></div>
    <div className="flex justify-between items-start mb-6 z-10">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${iconColor} transform group-hover:rotate-6 transition-transform`}>
         {icon ? icon : <span className="text-white font-black text-xl">{textIcon}</span>}
      </div>
      <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] font-sans uppercase">{label}</p>
    </div>
    <div className="z-10">
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{amount}</h3>
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{subtitle}</p>
    </div>
  </motion.div>
);

const QuickActionBtn = ({ icon, text, bg, iconBg, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-3 bg-white border ${bg} rounded-[30px] p-2 pr-5 shadow-sm transition-all duration-300 flex-shrink-0 group hover:-translate-y-1 hover:shadow-md`}>
    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${iconBg} shadow-inner group-hover:scale-105 transition-transform`}>
      {icon}
    </div>
    <span className="font-extrabold text-slate-800 text-[13px] tracking-wide">{text}</span>
  </button>
)

export default Dashboard;
