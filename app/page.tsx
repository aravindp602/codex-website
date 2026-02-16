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
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
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

      {/* --- Search Palette (Responsive Width) --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] md:pt-[15vh] px-4 bg-page-bg/30 backdrop-blur-2xl">
            <motion.div initial={{ scale: 0.99, y: -15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.99, y: -15 }} className="w-full max-w-2xl bg-card-bg border border-border-color shadow-2xl rounded-2xl md:rounded-[2rem] overflow-hidden">
              <div className="flex items-center px-4 md:px-7 py-4 md:py-6 border-b border-border-color gap-3 md:gap-5">
                <Search className="text-[#cf3222]" size={20} />
                <input ref={searchInputRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search protocols..." className="w-full bg-transparent outline-none text-base md:text-xl font-light text-text-main" />
                <button onClick={() => setIsSearchOpen(false)} className="text-text-muted hover:text-[#cf3222] transition-colors"><X size={22} /></button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2 md:p-3 no-scrollbar">
                {filteredData.map((item) => (
                  <button key={item.name} onClick={() => handleModuleClick(item.url)} className="w-full text-left p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-page-bg group flex items-center justify-between transition-all">
                    <div className="flex items-center gap-3 md:gap-5">
                      <div className="p-2 md:p-3 bg-page-bg rounded-xl text-text-muted group-hover:text-[#cf3222] transition-colors shadow-sm"><item.icon size={18} strokeWidth={1.5} /></div>
                      <span className="font-bold tracking-tight text-sm md:text-base text-text-main">{item.name}</span>
                    </div>
                    <ArrowUpRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Top Progress --- */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#cf3222] z-[70] origin-left shadow-[0_0_10px_rgba(207,50,34,0.4)]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} />

      {/* --- Responsive Nav --- */}
      <nav className={`fixed w-full z-50 transition-all duration-700 ${isNavScrolled ? "h-14 glass-nav shadow-sm" : "h-20 md:h-24 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-10">
            <span className="font-serif text-lg md:text-2xl font-black uppercase tracking-widest text-text-main">Codex</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-4 md:gap-10 font-sans">
            {user ? (
              <button onClick={() => supabase.auth.signOut()} className="text-[9px] md:text-[10px] uppercase tracking-widest font-black text-[#cf3222]">Sign Out</button>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="text-[9px] md:text-[10px] uppercase tracking-widest font-black text-text-muted hover:text-text-main">Sign In</button>
            )}
            <button onClick={() => !user && setIsAuthOpen(true)} className="bg-text-main text-page-bg px-4 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] uppercase tracking-widest font-black hover:bg-[#cf3222] hover:text-white transition-all shadow-lg active:scale-95">
              {user ? "Verified" : "Access"}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero (Fluid Scaling) --- */}
      <header className="pt-32 md:pt-52 pb-12 md:pb-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="relative">
          <div className="absolute -top-10 md:-top-20 -left-6 md:-left-12 text-[10rem] md:text-[20rem] font-black text-text-muted opacity-5 pointer-events-none select-none italic tracking-tighter">01</div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10">
            <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter mb-8 md:mb-12 text-text-main">
              Architect <br /> <span className="text-[#cf3222] italic font-light">Excellence.</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-end border-t border-border-color pt-8 md:pt-12">
               <p className="text-text-muted text-base md:text-xl font-light leading-relaxed max-w-md">Precision AI frameworks designed to restructure and automate the modern enterprise lifecycle.</p>
               
               {/* Responsive Search Box */}
               <div onClick={() => setIsSearchOpen(true)} className="w-full max-w-sm cursor-pointer group relative">
                  <div className="absolute inset-y-0 left-4 md:left-6 flex items-center text-[#cf3222]"><Search size={18} /></div>
                  <div className="w-full bg-card-bg border border-border-color rounded-xl md:rounded-2xl py-3 md:py-5 pl-12 md:pl-16 pr-4 md:pr-8 text-[10px] md:text-[11px] font-black tracking-[0.3em] text-text-muted flex justify-between items-center group-hover:border-[#cf3222]/40 transition-all shadow-sm">
                    SEARCH
                    <div className="hidden md:flex gap-1.5 items-center opacity-30 group-hover:opacity-100 transition-opacity bg-text-muted/10 px-2 py-1 rounded-md"><Command size={12}/> K</div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* --- Responsive Tabs --- */}
      <section className="px-4 md:px-8 sticky top-14 md:top-16 z-40 bg-page-bg/90 backdrop-blur-md border-b border-border-color py-4 md:py-6 transition-colors overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-6 md:gap-12 min-w-max">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`text-[9px] md:text-[11px] uppercase tracking-[0.2em] font-black transition-all relative py-1 ${activeTab === cat ? "text-[#cf3222]" : "text-text-muted hover:text-text-main"}`}>
              {cat} {activeTab === cat && <motion.div layoutId="activeTab" className="absolute -bottom-2 md:-bottom-2 left-0 right-0 h-0.5 bg-[#cf3222]" />}
            </button>
          ))}
        </div>
      </section>

      {/* --- Responsive Grid (1 to 3 Columns) --- */}
      <main className="px-4 md:px-8 py-12 md:py-24 pb-40 md:pb-48 max-w-7xl mx-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          <AnimatePresence mode="popLayout">
            {filteredData.map((codex, index) => (
              <motion.div key={codex.name} variants={itemVariants} layout onClick={() => handleModuleClick(codex.url)} className="group block cursor-pointer">
                <div className="relative aspect-[1.5/1] md:aspect-[1.4/1] bg-card-bg mb-4 md:mb-8 flex items-center justify-center transition-all duration-700 md:group-hover:scale-[0.98] rounded-2xl md:rounded-[2.5rem] border border-border-color group-hover:border-[#cf3222]/30 shadow-sm overflow-hidden md:group-hover:shadow-2xl">
                  
                  <div className="absolute top-4 md:top-8 left-4 md:left-8 flex items-center gap-2 md:gap-3">
                     <div className={`w-1 md:w-2 h-1 md:h-2 rounded-full ${user ? "bg-green-500" : "bg-[#cf3222]"} animate-pulse`} />
                     <span className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] opacity-30 font-black text-text-muted">{user ? "UNLOCKED" : "SECURED"}</span>
                  </div>

                  <div className="absolute top-4 md:top-8 right-4 md:right-8 text-text-muted opacity-20 group-hover:opacity-100 group-hover:text-[#cf3222] transition-all">
                    {user ? <ArrowUpRight size={20} /> : <Lock size={16} />}
                  </div>
                  
                  {/* Icon Tile (Scales with device) */}
                  <div className={`w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-[1.5rem] bg-page-bg border border-border-color flex items-center justify-center transition-all duration-700 shadow-sm ${user ? "group-hover:bg-[#cf3222] group-hover:rotate-6 group-hover:scale-110" : ""}`}>
                    <codex.icon strokeWidth={1.5} className={`w-6 h-6 md:w-8 md:h-8 transition-all duration-700 ${user ? "text-text-main group-hover:text-white" : "text-text-main opacity-20"}`} />
                  </div>
                  
                  <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 text-[7px] md:text-[9px] uppercase tracking-[0.4em] font-black opacity-10">MOD_0{index + 1}</div>
                </div>
                <div className="px-1 md:px-3 space-y-2">
                  <h3 className={`font-serif text-2xl md:text-3xl font-bold tracking-tight transition-colors text-text-main ${user ? "group-hover:text-[#cf3222]" : "opacity-40"}`}>{codex.name}</h3>
                  <p className="text-xs md:text-[15px] text-text-muted font-light leading-relaxed max-w-sm line-clamp-2">{codex.desc}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* --- Footer (Responsive Layout) --- */}
      <footer className="bg-[#050505] text-[#f5f5f5] py-20 md:py-40 px-4 md:px-8 transition-none overflow-hidden relative border-t border-white/5">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 md:gap-32 mb-20 md:mb-40">
            <div className="space-y-6 md:space-y-10">
              <h2 className="font-serif text-5xl md:text-8xl lg:text-[10rem] tracking-tighter leading-none text-zinc-100">Execute <br /> <span className="opacity-10 italic">Now.</span></h2>
              <button onClick={() => !user && setIsAuthOpen(true)} className="group flex items-center gap-4 md:gap-8 hover:text-[#cf3222] transition-all">
                <span className="text-[10px] md:text-[11px] font-black tracking-[0.4em] uppercase border-b border-white/10 group-hover:border-[#cf3222] pb-2 md:pb-3 transition-all">{user ? "VERIFIED" : "INITIALIZE"}</span>
                <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" />
              </button>
            </div>
            <div className="lg:pt-6 max-w-md space-y-8 md:space-y-16">
               <p className="text-lg md:text-2xl font-light leading-relaxed text-zinc-400 opacity-80">Strategic AI frameworks refreshed weekly for verified network members. Join the architecture of growth.</p>
               <div className="flex flex-wrap gap-6 md:gap-12 text-[9px] md:text-[10px] font-black tracking-widest uppercase text-zinc-600">
                  <Link href="#" className="hover:text-[#cf3222] transition-colors">Twitter</Link>
                  <Link href="#" className="hover:text-[#cf3222] transition-colors">Privacy</Link>
                  <Link href="#" className="hover:text-[#cf3222] transition-colors">Legal</Link>
               </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 text-[8px] md:text-[9px] uppercase tracking-[0.5em] text-zinc-700 font-bold">
            © {new Date().getFullYear()} Codex Suite
          </div>
        </div>
      </footer>
    </div>
  );
}