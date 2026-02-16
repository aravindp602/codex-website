"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Email/Password Logic ---
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = isLogin 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) {
        alert(error.message);
      } else {
        if (data?.session) {
          alert(isLogin ? "Welcome back." : "Registration successful.");
          onClose();
        } else if (data?.user) {
          // If Supabase Email Confirmation is ON
          alert("Success. Please check your email to verify your account.");
        }
      }
    } catch (err) {
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // --- Google OAuth Logic ---
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin 
      }
    });
    if (error) alert(error.message);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-xl px-6"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-12 right-12 text-zinc-400 hover:text-black transition-colors"
          >
            <X size={32} strokeWidth={1} />
          </button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-sm"
          >
            <div className="text-center mb-10">
              <h2 className="font-serif text-4xl mb-2">
                {isLogin ? "Sign In" : "Register"}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black">
                Codex Suite Protocol
              </p>
            </div>

            <div className="space-y-6">
              {/* Google Button with SVG */}
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-4 border border-zinc-200 py-4 rounded-full text-[10px] uppercase tracking-[0.2em] font-black hover:bg-zinc-50 hover:border-zinc-300 transition-all active:scale-[0.98] group"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
                  <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                  <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                  <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
                </svg>
                <span className="group-hover:text-black transition-colors">Continue with Google</span>
              </button>

              {/* Separator */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-100"></span>
                </div>
                <div className="relative flex justify-center text-[8px] uppercase tracking-[0.4em] font-black">
                  <span className="bg-white px-4 text-zinc-300 italic">Security Layer</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleEmailAuth} className="space-y-8">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-black text-zinc-400">Email Address</label>
                  <input 
                    type="email" required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-zinc-200 py-3 outline-none focus:border-codex-red text-sm transition-colors font-light"
                    placeholder="name@company.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-black text-zinc-400">Password</label>
                  <input 
                    type="password" required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-zinc-200 py-3 outline-none focus:border-codex-red text-sm transition-colors font-light"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-900 text-white py-4 rounded-full text-[10px] uppercase tracking-[0.2em] font-black hover:bg-codex-red disabled:bg-zinc-300 transition-all transform hover:scale-[1.01] shadow-lg shadow-zinc-100"
                >
                  {loading ? "Authenticating..." : isLogin ? "Sign In" : "Register Account"}
                </button>
              </form>
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-400 hover:text-codex-red transition-colors"
              >
                {isLogin ? "New user? Create Access" : "Have access? Sign In"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}