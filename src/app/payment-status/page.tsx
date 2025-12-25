"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { motion } from "framer-motion";
import { CheckCircle, ExternalLink, ArrowLeft, Home, Download, Share2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hash = searchParams.get("hash");
    const id = searchParams.get("id");
    const [claim, setClaim] = useState<any>(null);

    useEffect(() => {
        const fetchClaim = async () => {
            if (!id) return;
            const docRef = doc(db, "claims", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setClaim(docSnap.data());
            }
        };
        fetchClaim();
    }, [id]);

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Success particles (simplified) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-success/20 blur-[100px] rounded-full animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full glass p-10 rounded-[40px] border border-success/30 bg-success/[0.02] text-center space-y-8 relative z-10"
            >
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center p-6 glow-success">
                        <CheckCircle size={64} className="text-success" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic text-success">Settlement Reached</h1>
                    <p className="text-slate-400 font-medium">Claim #{id?.substring(0, 8)} has been broadcast and settled via MNEE.</p>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-3xl p-6 space-y-4 text-left">
                    <div className="flex justify-between items-center text-sm font-tech">
                        <span className="text-slate-500 uppercase">Provider Receipt</span>
                        <span className="text-white font-bold">{claim?.providerName}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-tech">
                        <span className="text-slate-500 uppercase">Amount Disbursed</span>
                        <span className="text-primary font-black text-xl">₹{claim?.totalPayable}</span>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Immutable Tx Hash</span>
                        <div className="flex items-center justify-between space-x-4">
                            <code className="text-xs text-slate-400 truncate bg-white/5 px-3 py-2 rounded-lg flex-1 font-mono">
                                {hash}
                            </code>
                            <a
                                href={`https://sepolia.etherscan.io/tx/${hash}`}
                                target="_blank"
                                className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary hover:text-black transition-all"
                            >
                                <ExternalLink size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                    <button className="w-full md:w-auto px-8 py-4 glass text-sm font-bold rounded-2xl flex items-center justify-center space-x-2 hover:bg-white/5 transition-all">
                        <Download size={18} />
                        <span>Download Receipt</span>
                    </button>
                    <Link href="/upload" className="w-full md:w-auto px-8 py-4 bg-white text-black text-sm font-black rounded-2xl flex items-center justify-center space-x-2 hover:scale-105 transition-all shadow-xl">
                        <ArrowLeft size={18} />
                        <span>New Claim</span>
                    </Link>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-center space-x-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-success" />
                    <span>Transaction finalized on Ethereum Settlement Layer</span>
                </div>
            </motion.div>

            <Link href="/" className="mt-12 text-slate-500 hover:text-white transition-colors flex items-center space-x-2 font-bold text-sm">
                <Home size={16} />
                <span>Return to Home</span>
            </Link>
        </main>
    );
}

export default function PaymentStatusPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-primary font-bold">Loading Verification...</div>}>
            <PaymentStatusContent />
        </Suspense>
    );
}
