import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Shield, LogOut, Layers } from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Admin', email: 'admin@invoiceora.com' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { name: 'Invoices', icon: <FileText size={18} />, path: '/dashboard/invoices' },
    { name: 'Clients', icon: <Users size={18} />, path: '/dashboard/clients' },
    { name: 'Admin', icon: <Shield size={18} />, path: '/dashboard/admin' },
  ];

  return (
    <div className="w-[260px] bg-[#1a1129] flex flex-col justify-between h-full rounded-r-3xl overflow-hidden shadow-2xl relative z-20">
      <div>
        {/* Logo Section */}
        <div className="p-6 pt-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-[0_4px_20px_rgba(147,51,234,0.3)]">
            <Layers size={20} />
          </div>
          <div>
             <h1 className="text-white text-xl font-black tracking-tighter">Invoiceora</h1>
             <p className="text-fuchsia-500 text-[10px] font-black uppercase tracking-widest leading-tight">Enterprise</p>
          </div>
        </div>

        {/* Menu */}
        <div className="px-6 mt-6">
           <p className="text-slate-500 text-xs font-bold tracking-widest mb-4">MENU</p>
           <nav className="space-y-1">
             {navItems.map((item) => (
               <NavLink
                 key={item.name}
                 to={item.path}
                 onClick={onClose}
                 end={item.path === '/dashboard'}
                 className={({ isActive }) => 
                   `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                     isActive 
                       ? 'bg-[#2d1b46] text-white border border-[#44296b] shadow-inner' 
                       : 'text-slate-400 hover:text-white hover:bg-white/5'
                   }`
                 }
               >
                 <span className={`${window.location.pathname === item.path || (item.path==='/dashboard' && window.location.pathname==='/dashboard') ? 'text-brand' : 'text-slate-500'}`}>
                    {item.icon}
                 </span>
                 <span className="text-sm">{item.name}</span>
               </NavLink>
             ))}
           </nav>
        </div>
      </div>

      {/* Admin Footer */}
      <div className="p-4 mx-4 mb-6 mt-auto">
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#c026d3] rounded-full flex items-center justify-center text-white font-bold uppercase">
               {user.name.charAt(0)}
             </div>
             <div>
               <p className="text-white text-sm font-bold">{user.name}</p>
               <p className="text-slate-500 text-xs truncate w-24">{user.email}</p>
             </div>
           </div>
           <button onClick={handleLogout} className="text-slate-500 hover:text-white transition-colors" title="Logout">
              <LogOut size={16} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
