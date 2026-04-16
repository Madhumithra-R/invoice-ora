import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, Phone, Building2, Plus, Edit2, Search, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', company: '', email: '', phone: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/invoices', { headers: { Authorization: `Bearer ${token}` } });
      const clientMap = {};
      res.data.forEach(inv => {
        if (!clientMap[inv.clientName]) {
          clientMap[inv.clientName] = { 
            name: inv.clientName, 
            email: `${inv.clientName.replace(/\s+/g,'').toLowerCase()}@domain.com`,
            phone: '+1-555-' + Math.floor(1000 + Math.random() * 9000),
            company: inv.clientName + (inv.clientName.includes('Ltd') || inv.clientName.includes('Inc') ? '' : ' Corp')
          };
        }
      });
      // Merge with custom saved clients from localstorage
      const customClients = JSON.parse(localStorage.getItem('customClients') || '[]');
      customClients.forEach(c => { if(!clientMap[c.name]) clientMap[c.name] = c; });
      
      setClients(Object.values(clientMap));
    } catch (e) {}
  };

  const getInitials = (name) => {
    return name.substring(0,2).toUpperCase();
  };

  const getColor = (name) => {
    const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-fuchsia-500', 'bg-purple-500', 'bg-rose-500', 'bg-teal-500'];
    let val = 0;
    for (let i = 0; i < name.length; i++) val += name.charCodeAt(i);
    return colors[val % colors.length];
  }

  const handleSaveClient = () => {
    if (!newClient.name) return toast.error("Client name is required");
    let customClients = JSON.parse(localStorage.getItem('customClients') || '[]');
    
    if (isEditing) {
      customClients = customClients.filter(c => c.name !== newClient.name); // Remove old record if exact edit
      customClients.push(newClient);
      toast.success("Client details updated!");
    } else {
      customClients.push(newClient);
      toast.success("Client added directly!");
    }

    localStorage.setItem('customClients', JSON.stringify(customClients));
    setIsModalOpen(false);
    setIsEditing(false);
    setNewClient({ name: '', company: '', email: '', phone: '' });
    fetchData();
  };

  const handleEditClick = (client) => {
    setNewClient(client);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto mt-2">
      
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_20px_70px_rgba(0,0,0,0.3)] border border-white/20"
            >
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-8">{isEditing ? 'Edit Client' : 'Add Client'}</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2">FULL NAME</label>
                  <input value={newClient.name} onChange={e=>setNewClient({...newClient, name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand/20 font-bold transition-all" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2">COMPANY</label>
                  <input value={newClient.company} onChange={e=>setNewClient({...newClient, company: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand/20 font-bold transition-all" placeholder="e.g. Acme Corp" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2">EMAIL</label>
                    <input value={newClient.email} onChange={e=>setNewClient({...newClient, email: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand/20 font-bold transition-all" placeholder="john@acme.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2">PHONE</label>
                    <input value={newClient.phone} onChange={e=>setNewClient({...newClient, phone: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand/20 font-bold transition-all" placeholder="+1 555 1234" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-10 justify-end">
                <button onClick={() => { setIsModalOpen(false); setIsEditing(false); setNewClient({name:'', company:'', email:'', phone:''}); }} className="px-7 py-3 rounded-full font-black text-xs tracking-widest uppercase text-slate-400 hover:text-slate-600 transition-colors">CANCEL</button>
                <button onClick={handleSaveClient} className="px-8 py-3.5 rounded-full font-black text-xs tracking-widest uppercase text-white bg-slate-900 shadow-xl hover:bg-black transition-all transform hover:-translate-y-1">{isEditing ? 'UPDATE RECORD' : 'SAVE CLIENT'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-8 mb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-fuchsia-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/20">
             <Users size={24} />
          </div>
          <div>
            <p className="text-slate-400 font-black text-[10px] tracking-[0.2em] uppercase mb-1">Global Network</p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">Clients</h1>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-8 py-3.5 rounded-full flex items-center gap-2 shadow-2xl shadow-slate-200 hover:shadow-slate-400 hover:-translate-y-1 transition-all font-bold text-sm">
          <Plus size={18} /> New Client
        </button>
      </div>

      <div className="relative mb-12 max-w-xl group">
        <Search size={18} className="text-slate-300 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-brand transition-colors" />
        <input 
           type="text" 
           value={searchTerm} 
           onChange={(e) => setSearchTerm(e.target.value)} 
           placeholder="Search network records..." 
           className="w-full pl-14 pr-4 py-4 bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] rounded-[1.5rem] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/20 transition-all" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length === 0 && <div className="col-span-full py-10 text-center text-slate-400 font-medium font-sm">No clients found meeting criteria.</div>}
        {filteredClients.map((client, idx) => (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.05 }}
             key={client.name} 
             className="bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all relative group"
           >
             <button onClick={() => handleEditClick(client)} className="absolute right-5 top-5 flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl font-black text-[10px] tracking-widest uppercase transition-all duration-300 border border-slate-100 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
               <Edit2 size={12}/> EDIT
             </button>
             
             <div className="flex items-center gap-5 mb-8">
               <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-xl ${getColor(client.name)}`}>
                 {getInitials(client.name)}
               </div>
               <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">{client.name}</h3>
                 <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                   <Building2 size={12} className="text-slate-300" /> {client.company}
                 </p>
               </div>
             </div>

             <div className="space-y-4 pt-6 border-t border-slate-50">
               <div className="flex items-center gap-4 text-[13px] text-slate-600 font-bold">
                 <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <Mail size={16}/>
                 </div>
                 {client.email}
               </div>
               <div className="flex items-center gap-4 text-[13px] text-slate-600 font-bold">
                 <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <Phone size={16}/>
                 </div>
                 {client.phone}
               </div>
             </div>
           </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClientsPage;
