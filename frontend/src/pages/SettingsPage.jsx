import React, { useState } from 'react';
import { User, Bell, Lock, Palette, Search, Shield, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [settings, setSettings] = useState({
    companyName: 'Invoiceora Inc.',
    email: 'admin@invoiceora.com',
    taxId: 'XX-123456789',
    address: '123 SaaS Street, Tech Valley, CA 90210'
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const tabs = [
    { name: 'Profile' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-7xl mx-auto px-4 pb-20"
    >
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[10px] font-black tracking-[0.2em] uppercase transition-all mt-8 mb-4 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO DASHBOARD
      </button>

      <div className="mb-12">
        <p className="text-slate-400 font-black text-[10px] tracking-[0.2em] uppercase mb-2">Configuration</p>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar Menu */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full text-left px-7 py-4 rounded-[1.5rem] font-black text-xs tracking-widest uppercase transition-all ${
                activeTab === tab.name 
                ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300 transform scale-[1.02]' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          {activeTab === 'Profile' && (
            <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100/50">
              <div className="flex items-center gap-6 border-b border-slate-50 pb-10 mb-10">
                <div className="w-24 h-24 rounded-[2rem] bg-indigo-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-100 transform rotate-3">
                  <User size={36} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Company Profile</h2>
                  <p className="text-slate-400 font-bold text-sm">Update your public identity and tax information.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2">COMPANY NAME</label>
                  <input 
                    type="text" 
                    value={settings.companyName}
                    onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                    className="w-full bg-slate-50 border-transparent px-5 py-3.5 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand/20 font-bold text-slate-800 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="w-full bg-slate-50 border-transparent px-5 py-3.5 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand/20 font-bold text-slate-800 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2">TAX ID / VAT IDENTIFIER</label>
                  <input 
                    type="text" 
                    value={settings.taxId}
                    onChange={(e) => setSettings({...settings, taxId: e.target.value})}
                    className="w-full bg-slate-50 border-transparent px-5 py-3.5 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand/20 font-bold text-slate-800 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2">OFFICE HEADQUARTERS</label>
                  <textarea 
                    value={settings.address}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                    rows="4"
                    className="w-full bg-slate-50 border-transparent px-5 py-3.5 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand/20 font-bold text-slate-800 transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-12">
                <button className="px-8 py-3.5 rounded-full text-slate-400 font-black text-xs tracking-widest uppercase hover:text-slate-600 transition-colors">
                  DISCARD
                </button>
                <button 
                  onClick={handleSave}
                  className="px-8 py-3.5 rounded-full text-white font-black text-xs tracking-widest uppercase bg-slate-900 shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all"
                >
                  SAVE CONFIGURATION
                </button>
              </div>
            </div>
          )}

          {activeTab !== 'Profile' && (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 font-medium text-sm">
              {activeTab} settings are under construction.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
