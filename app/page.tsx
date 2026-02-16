"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { codexData } from "./data";
import { ArrowUpRight, ArrowRight, ShieldCheck, Lock, Search, Command, X } from "lucide-react";
import Link from "next/link";
import AuthModal from "./components/AuthModal";
import ThemeToggle from "./components/ThemeToggle";
import { supabase } from "./lib/supabase";

const categories = ["All", "Core", "Brand", "Growth", "Conversion"];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("All");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setIsSearchOpen(true); }
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    const handleScroll = () => setIsNavScrolled(window.scrollY > 20);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => { if (isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 100); }, [isSearchOpen]);

  const handleModuleClick = (url: string) => {
    if (user) { window.open(url, "_blank"); } 
    else { setIsSearchOpen(false); setIsAuthOpen(true); }
  };

  const filteredData = useMemo(() => {
    return codexData.filter(item => {
      const matchesTab = activeTab === "All" || item.category === activeTab;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-page-bg text-text-main transition-colors duration-500 selection:bg-[#cf3222] selection:text-white">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* --- Cmd+K Search Overlay --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-page-bg/30 backdrop-blur-2xl">
            <motion.div initial={{ scale: 0.99, y: -15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.99, y: -15 }} className="w-full max-w-2xl bg-card-bg border border-border-color shadow-2xl rounded-[2rem] overflow-hidden">
              <div className="flex items-center px-7 py-6 border-b border-border-color gap-5">
                <Search className="text-[#cf3222]" size={22} />
                <input ref={searchInputRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Architecture..." className="w-full bg-transparent outline-none text-xl font-light text-text-main" />
                <button onClick={() => setIsSearchOpen(false)} className="text-text-muted hover:text-[#cf3222] transition-colors"><X size={22} /></button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto p-3 no-scrollbar">
                {filteredData.map((item) => (
                  <button key={item.name} onClick={() => handleModuleClick(item.url)} className="w-full text-left p-4 rounded-2xl hover:bg-page-bg group flex items-center justify-between transition-all">
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-page-bg rounded-xl text-text-muted group-hover:text-[#cf3222] transition-colors shadow-sm"><item.icon size={20} strokeWidth={1.5} /></div>
                      <span className="font-bold tracking-tight text-base text-text-main">{item.name}</span>
                    </div>
                    <ArrowUpRight size={18} className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#cf3222] z-[70] origin-left shadow-[0_0_10px_rgba(207,50,34,0.4)]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} />

      {/* --- Nav --- */}
      <nav className={`fixed w-full z-50 transition-all duration-700 ${isNavScrolled ? "h-16 glass-nav" : "h-24 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-10">
            <span className="font-serif text-2xl font-black uppercase tracking-widest text-text-main">Codex</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-10 font-sans">
            {user ? (
              <button onClick={() => supabase.auth.signOut()} className="text-[10px] uppercase tracking-widest font-black text-[#cf3222]">Disconnect</button>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="text-[10px] uppercase tracking-widest font-black text-text-muted hover:text-text-main">Sign In</button>
            )}
            <button onClick={() => !user && setIsAuthOpen(true)} className="bg-text-main text-page-bg px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-black hover:bg-[#cf3222] hover:text-white transition-all shadow-xl">
              {user ? "Authenticated" : "Get Access"}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero --- */}
      <header className="pt-52 pb-20 px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="relative">
          <div className="absolute -top-20 -left-12 text-[20rem] font-black text-text-muted opacity-5 pointer-events-none select-none italic tracking-tighter">01</div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10">
            <h1 className="font-serif text-7xl md:text-9xl leading-[0.85] tracking-tighter mb-12 text-text-main">
              Architect <br /> <span className="text-[#cf3222] italic font-light">Excellence.</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-end border-t border-border-color pt-12">
               <p className="text-text-muted text-xl font-light leading-relaxed max-w-md">Precision AI frameworks designed to restructure and automate the modern enterprise lifecycle.</p>
               <div onClick={() => setIsSearchOpen(true)} className="w-full max-w-sm cursor-pointer group relative ml-auto">
                  <div className="absolute inset-y-0 left-6 flex items-center text-[#cf3222]"><Search size={20} /></div>
                  <div className="w-full bg-card-bg border border-border-color rounded-2xl py-5 pl-16 pr-8 text-[11px] font-black tracking-[0.3em] text-text-muted flex justify-between items-center group-hover:border-[#cf3222]/40 transition-all shadow-sm">
                    SEARCH PROTOCOL
                    <div className="flex gap-1.5 items-center opacity-30 group-hover:opacity-100 transition-opacity bg-text-muted/10 px-2 py-1 rounded-md"><Command size={12}/> K</div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* --- Tabs --- */}
      <section className="px-8 sticky top-16 md:top-16 z-40 bg-page-bg/90 backdrop-blur-md border-b border-border-color py-6 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center gap-12 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`text-[11px] uppercase tracking-[0.2em] font-black transition-all relative py-1 ${activeTab === cat ? "text-[#cf3222]" : "text-text-muted hover:text-text-main"}`}>
              {cat} {activeTab === cat && <motion.div layoutId="activeTab" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#cf3222]" />}
            </button>
          ))}
        </div>
      </section>

      {/* --- Grid --- */}
      <main className="px-8 py-24 pb-48 max-w-7xl mx-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredData.map((codex, index) => (
              <motion.div key={codex.name} variants={itemVariants} layout onClick={() => handleModuleClick(codex.url)} className="group block cursor-pointer">
                <div className="relative aspect-[1.4/1] bg-card-bg mb-8 flex items-center justify-center transition-all duration-700 group-hover:scale-[0.98] rounded-[2.5rem] border border-border-color group-hover:border-[#cf3222]/30 shadow-sm overflow-hidden group-hover:shadow-2xl group-hover:-translate-y-2">
                  <div className="absolute top-8 left-8 flex items-center gap-3">
                     <div className={`w-2 h-2 rounded-full ${user ? "bg-green-500" : "bg-[#cf3222]"} animate-pulse`} />
                     <span className="text-[8px] uppercase tracking-[0.4em] opacity-30 font-black text-text-muted">{user ? "UNLOCKED" : "SECURED"}</span>
                  </div>
                  <div className="absolute top-8 right-8 text-text-muted opacity-10 group-hover:opacity-100 group-hover:text-[#cf3222] transition-all">
                    {user ? <ArrowUpRight size={24} strokeWidth={1.5} /> : <Lock size={20} strokeWidth={1.5} />}
                  </div>
                  
                  <div className={`w-20 h-20 rounded-[1.5rem] bg-page-bg border border-border-color flex items-center justify-center transition-all duration-700 shadow-sm ${user ? "group-hover:bg-[#cf3222] group-hover:rotate-6 group-hover:scale-110" : ""}`}>
                    <codex.icon strokeWidth={1.5} size={32} className={`transition-all duration-700 ${user ? "text-text-main group-hover:text-white" : "text-text-main opacity-20"}`} />
                  </div>
                  
                  <div className="absolute bottom-8 left-8 text-[9px] uppercase tracking-[0.4em] font-black opacity-10">MOD_0{index + 1}</div>
                </div>
                <div className="px-3 space-y-3">
                  <h3 className={`font-serif text-3xl font-bold tracking-tight transition-colors text-text-main ${user ? "group-hover:text-[#cf3222]" : "opacity-40"}`}>{codex.name}</h3>
                  <p className="text-[15px] text-text-muted font-light leading-relaxed max-sm line-clamp-2">{codex.desc}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* --- Black Footer (Always Dark) --- */}
      <footer className="bg-[#050505] text-[#f5f5f5] py-40 px-8 transition-none overflow-hidden relative border-t border-white/5">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-32 mb-20">
            <div className="space-y-10">
              <h2 className="font-serif text-8xl md:text-[10rem] tracking-tighter leading-[0.8] text-zinc-100">Execute <br /> <span className="opacity-10 italic">Now.</span></h2>
              <button onClick={() => !user && setIsAuthOpen(true)} className="group flex items-center gap-8 hover:text-[#cf3222] transition-all">
                <span className="text-[11px] font-black tracking-[0.4em] uppercase border-b border-white/10 group-hover:border-[#cf3222] pb-3 transition-all">{user ? "CONNECTED" : "INITIALIZE PROTOCOL"}</span>
                <ArrowRight size={24} className="group-hover:translate-x-4 transition-transform duration-500" />
              </button>
            </div>
            <div className="lg:pt-6 max-w-md space-y-16">
               <p className="text-2xl font-light leading-relaxed text-zinc-400 opacity-80">Strategic AI frameworks refreshed weekly for verified network members. Join the architecture of growth.</p>
               <div className="flex gap-12 text-[10px] font-black tracking-widest uppercase text-zinc-600">
                  <Link href="#" className="hover:text-[#cf3222] transition-colors">Twitter</Link>
                  <Link href="#" className="hover:text-[#cf3222] transition-colors">Privacy</Link>
                  <Link href="#" className="hover:text-[#cf3222] transition-colors">Legal</Link>
               </div>
            </div>
          </div>
          <div className="pt-16 border-t border-white/5 text-[9px] uppercase tracking-[0.5em] text-zinc-700 font-bold">
            © {new Date().getFullYear()} Codex Suite / Architecture of Growth
          </div>
        </div>
      </footer>
    </div>
  );
}