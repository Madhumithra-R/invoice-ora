import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Download, 
  CreditCard, 
  BarChart3, 
  Shield, 
  ChevronRight, 
  Layers,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

const features = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Smart Invoicing",
    desc: "Create, edit and automate invoices effortlessly with our intelligent builder.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Client Hub",
    desc: "Manage client relationships and store essential data securely in one place.",
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: "One-Click Export",
    desc: "Instantly generate print-ready PDFs and professional digital receipts.",
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Real-time Tracking",
    desc: "Never miss a payment. Track pending, paid, and overdue invoices instantly.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Advanced Analytics",
    desc: "Visualize your cash flow with beautiful, interactive revenue charts.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Enterprise Security",
    desc: "Bank-level encryption and secure authentication to protect your data.",
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLogged = !!localStorage.getItem('token');

  return (
    <div className="relative min-h-screen bg-[#fcfcfd] text-slate-900 font-sans selection:bg-pink-100 overflow-x-hidden">
      
      {/* Premium Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-100/40 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-100/40 blur-[150px] rounded-full" />
      </div>

      {/* NAVBAR - Glassmorphism */}
      <nav className="fixed w-full z-50 top-0 border-b border-slate-200/40 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
               <Layers size={18} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">Invoiceora</h1>
              <p className="text-fuchsia-600 text-[8px] font-black uppercase tracking-[0.2em] mt-0.5">Enterprise</p>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <a 
              href="#features" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-bold text-slate-500 hover:text-slate-900 px-4 py-2 transition-colors"
            >
              Features
            </a>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold text-slate-600 px-5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                 Log In
              </Link>
              <Link to="/register" className="text-sm font-bold text-pink-600 px-5 py-2 rounded-xl border border-pink-100 bg-pink-50/50 hover:bg-pink-50 transition-all">
                 Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                <a 
                  href="#features" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm font-bold text-slate-600"
                >
                  Features
                </a>
                {!isLogged ? (
                  <>
                    <Link to="/login" className="text-sm font-bold text-slate-600">Log In</Link>
                    <Link to="/register" className="text-sm font-bold text-pink-600">Sign Up</Link>
                    <Link to="/register" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm text-center">
                       Get Started
                    </Link>
                  </>
                ) : (
                  <Link to="/dashboard" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm text-center">
                    Dashboard
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-8 max-w-7xl mx-auto z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center text-center lg:text-left">
          <motion.div 
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="max-w-2xl mx-auto lg:mx-0"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-xs font-black uppercase tracking-wider mb-8">
              <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
              Modern Billing Reimagined
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-6xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-8">
              Get paid faster <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600">
                smart invoicing.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
              Create and manage invoices in seconds. A precision platform built to streamline your cash flow with elegance.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-10 py-5 text-lg font-black text-white transition-all bg-slate-900 rounded-full hover:bg-slate-800 hover:scale-105 shadow-2xl active:scale-95"
              >
                Start Free Trial <ChevronRight className="w-5 h-5" />
              </Link>
              {!isLogged && (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-10 py-5 text-lg font-black text-slate-900 transition-all border-2 border-slate-200 rounded-full hover:bg-slate-50 hover:scale-105 active:scale-95"
                >
                  Log In
                </Link>
              )}
            </motion.div>
          </motion.div>

          {/* Floating UI Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-200/50 to-violet-200/50 blur-[100px] rounded-[3rem]" />
            
            <div className="relative p-10 rounded-[3rem] bg-white/80 backdrop-blur-2xl border border-white shadow-2xl">
              <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-6">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                  <h2 className="text-4xl font-black text-slate-900 leading-none">₹1,42,450</h2>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <BarChart3 className="w-7 h-7 text-emerald-500" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: "INV-001", client: "TechFlow Inc.", amount: "₹45,000", status: "Paid", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { id: "INV-002", client: "Studio Design", amount: "₹12,500", status: "Pending", color: "text-amber-600", bg: "bg-amber-50" },
                  { id: "INV-003", client: "Global Corp", amount: "₹84,950", status: "Overdue", color: "text-rose-600", bg: "bg-rose-50" }
                ].map((inv, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-pink-200 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center font-black text-xs text-slate-400 border border-slate-100 group-hover:bg-pink-50 transition-colors">
                        {inv.client.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-pink-600 transition-colors">{inv.client}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{inv.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 leading-none mb-1">{inv.amount}</p>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${inv.bg} ${inv.color}`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="px-8 py-32 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">Everything you need to scale</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">Powerful features hidden behind a beautiful, simple interface.</p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -10 }}
              className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-pink-200 hover:shadow-2xl hover:shadow-pink-500/5 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center mb-8 group-hover:bg-pink-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                <div className="text-pink-600 group-hover:text-white transition-colors">{f.icon}</div>
              </div>
              <h3 className="font-black text-2xl text-slate-900 mb-4 tracking-tight leading-tight">{f.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white text-center py-12 relative z-10">
        <p className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em]">
          © 2026 Invoiceora. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
