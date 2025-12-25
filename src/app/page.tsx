"use client";

import React from "react";
import { Shield, Zap, Lock, Globe, Cpu, Coins, Search, ArrowRight, Layers, LogIn, User as UserIcon, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/AuthProvider";

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-primary selection:text-black">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary opacity-10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary opacity-10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-background/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center p-2 glow-primary">
            <Cpu size={24} className="text-black" />
          </div>
          <span className="text-xl font-black tracking-tighter">MediClaim<span className="text-primary italic">AI</span></span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-primary transition-colors">How it Works</a>
          <a href="#security" className="hover:text-primary transition-colors">Security</a>
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <UserIcon size={16} />
                <span className="max-w-[100px] truncate">{user.displayName || user.email}</span>
              </div>
              <button onClick={signOut} className="text-slate-400 hover:text-error transition-colors">Sign Out</button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center space-x-2 px-6 py-2 bg-primary text-black font-bold rounded-full hover:scale-105 transition-all shadow-lg glow-primary">
              <LogIn size={16} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-48 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center space-y-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border border-white/10 text-primary text-xs font-bold uppercase tracking-widest shadow-2xl"
          >
            <Zap size={14} fill="currentColor" />
            <span>Autonomous Claims Extraction & Settlement</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9]"
          >
            Indian Healthcare <br />
            <span className="gradient-text italic">Redefined.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            MediClaimAI uses Gemini 2.0 to extract billing data and Ethereum MNEE for
            instant provider settlements. Secure, transparent, and built for scale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-10 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6"
          >
            <Link href={user ? "/upload" : "/login"} className="px-10 py-5 bg-white text-black text-lg font-black rounded-2xl hover:scale-105 transition-all shadow-2xl flex items-center group">
              Start Your First Claim
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="px-10 py-5 glass text-lg font-bold rounded-2xl hover:bg-white/5 transition-all">
              Watch Demo
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-40 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl font-black tracking-tight uppercase">The Three Pillars</h2>
            <p className="text-slate-400 text-lg">Engineered for accuracy and instant liquidity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-8 group">
              <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center border border-cyan-400/20 group-hover:scale-110 group-hover:bg-cyan-400 group-hover:text-black transition-all duration-500 shadow-lg glow-primary">
                <Search size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold flex items-center">
                  01. Smart Extraction
                  <Layers size={18} className="ml-2 text-slate-700" />
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Upload any Indian medical bill. Our Gemini 2.0 agent extracts provider details, GSTIN, and line items with absolute precision.
                </p>
              </div>
            </div>

            <div className="space-y-8 group">
              <div className="w-16 h-16 rounded-2xl bg-violet-400/10 text-violet-400 flex items-center justify-center border border-violet-400/20 group-hover:scale-110 group-hover:bg-violet-400 group-hover:text-black transition-all duration-500 shadow-lg glow-primary">
                <Shield size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold flex items-center">
                  02. Review & Guardrail
                  <Lock size={18} className="ml-2 text-slate-700" />
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Human-in-the-loop ensures 100% data fidelity. Review the extracted claim summary before authorizing the final settlement.
                </p>
              </div>
            </div>

            <div className="space-y-8 group">
              <div className="w-16 h-16 rounded-2xl bg-pink-400/10 text-pink-400 flex items-center justify-center border border-pink-400/20 group-hover:scale-110 group-hover:bg-pink-400 group-hover:text-black transition-all duration-500 shadow-lg glow-primary">
                <Coins size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold flex items-center">
                  03. Instant Liquidity
                  <Globe size={18} className="ml-2 text-slate-700" />
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Settle claims on Ethereum via MNEE. No more 30-day waiting periods for hospitals. Funds move at the speed of the internet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <Cpu size={16} />
              <span className="font-bold">MediClaimAI Protocol v2.0</span>
            </div>
            <span className="text-slate-800">|</span>
            <div className="flex items-center space-x-2">
              <ShieldCheck size={16} className="text-success" />
              <span>Compliant Infrastructure</span>
            </div>
          </div>
          <p>© 2025 MediClaimAI Inc. Built for the Indian Digital Health Stack.</p>
        </div>
      </footer>
    </main>
  );
}
