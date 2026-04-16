import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Settings, LogOut, ChevronRight, CheckCircle2, AlertCircle, Clock, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);
  
  const [notifs, setNotifs] = useState([]);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Admin User', email: 'admin@invoiceora.com' };
  
  const location = useLocation();
  const navigate = useNavigate();

  // Determine breadcrumb based on path
  const path = location.pathname;
  let pageName = 'Dashboard';
  if (path.includes('/invoices/new')) pageName = 'New Invoice';
  else if (path.includes('/invoices')) pageName = 'Invoices';
  else if (path.includes('/clients')) pageName = 'Clients';
  else if (path.includes('/admin')) pageName = 'Admin';
  else if (path.includes('/settings')) pageName = 'Settings';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleDark = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="flex justify-between items-center mb-6 pl-0 md:pl-2 pr-0 md:pr-4 relative z-50">
      {/* Breadcrumb + Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-100 mr-1"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center text-[10px] font-black tracking-[0.2em] text-slate-400 gap-2 uppercase">
          <span className="hover:text-brand cursor-default hidden sm:inline">Invoiceora</span>
          <ChevronRight size={12} className="text-slate-300 hidden sm:inline" />
          <span className="text-slate-900">{pageName}</span>
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        <button onClick={toggleDark} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          {isDark ? <Sun size={18} className="text-brand" /> : <Moon size={18} />}
        </button>
        
        <div className="relative">
          <button onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 relative">
            <Bell size={18} />
            {notifs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 p-1 px-1.5 bg-fuchsia-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">{notifs.length}</span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-50">
                <h3 className="font-extrabold text-slate-800 text-sm">Notifications</h3>
                <button onClick={() => setNotifs([])} className="text-fuchsia-500 text-xs font-bold hover:underline">Mark all read</button>
              </div>
              <div className="flex flex-col max-h-[300px] overflow-y-auto">
                {notifs.length === 0 ? (
                  <p className="text-center p-6 text-slate-400 font-medium text-xs">No new notifications</p>
                ) : (
                  notifs.map((n, i) => (
                    <div key={n.id} className="flex gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 relative group">
                      <div className="w-2 h-2 rounded-full bg-fuchsia-500 absolute right-4 top-1/2 -translate-y-1/2"></div>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform ${
                         n.type==='success' ? 'bg-emerald-50 text-emerald-500' :
                         n.type==='error' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'
                      }`}>
                        {n.type==='success' ? <CheckCircle2 size={18}/> : n.type==='error' ? <AlertCircle size={18}/> : <Clock size={18}/>}
                      </div>
                      <div>
                        <h4 className="text-slate-800 font-bold text-sm">{n.title}</h4>
                        <p className="text-slate-500 text-xs font-medium mt-0.5">{n.desc}</p>
                        <p className="text-slate-400 text-[10px] font-bold mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }} 
            className="w-10 h-10 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg transition-all"
          >
            {user.name.charAt(0).toUpperCase()}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 py-4 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-6 py-2">
                <p className="font-black text-slate-900 text-sm italic tracking-tight">{user.name}</p>
                <p className="text-slate-400 text-xs font-bold mt-0.5 tracking-tight">{user.email}</p>
                <span className="inline-block mt-2 px-2 py-0.5 border border-emerald-200 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md flex items-center gap-1 w-max">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Admin
                </span>
              </div>
              <div className="h-px bg-slate-100 my-2 w-full" />
              <button onClick={() => { setIsProfileOpen(false); navigate('/dashboard/settings'); }} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 text-slate-600 font-semibold text-sm w-full text-left transition-colors">
                <Settings size={16} /> Settings
              </button>
              <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-2.5 hover:bg-red-50 text-red-500 font-semibold text-sm w-full text-left transition-colors">
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
