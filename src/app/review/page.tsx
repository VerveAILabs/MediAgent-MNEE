"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ShieldAlert, CreditCard, ArrowLeft, Loader2, Link as LinkIcon, ExternalLink } from "lucide-react";
import { ethers } from "ethers";
import Link from "next/link";
import { Suspense } from "react";

function ReviewContent() {
    const { user, loading: authLoading, walletAddress, connectWallet } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const claimId = searchParams.get("id");

    const [claimData, setClaimData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        const fetchClaim = async () => {
            if (!claimId) return;
            try {
                const docRef = doc(db, "claims", claimId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setClaimData(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching claim:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClaim();
    }, [user, authLoading, claimId, router]);

    const handlePayment = async () => {
        if (!walletAddress) {
            await connectWallet();
            return;
        }

        setIsPaying(true);
        try {
            // Failsafe: Trigger payment and capture hash immediately
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // For Demo: we'll simulate a transaction
            const tx = await signer.sendTransaction({
                to: claimData.providerWallet || "0x0000000000000000000000000000000000000000",
                value: ethers.parseEther("0.001"), // Mock value
            });

            setTxHash(tx.hash);

            // Record Tx Hash immediately (Failsafe)
            await fetch("/api/record-tx", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    claimId,
                    txHash: tx.hash,
                    status: "SETTLED"
                })
            });

            setTimeout(() => {
                router.push(`/payment-status?hash=${tx.hash}&id=${claimId}`);
            }, 2000);

        } catch (error) {
            console.error("Payment failed", error);
            setIsPaying(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (!claimData) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
                <ShieldAlert size={64} className="text-error" />
                <h1 className="text-2xl font-bold">Claim Record Not Found</h1>
                <Link href="/upload" className="text-primary hover:underline">Return to Upload</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground py-12 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                    <div className="px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                        Human-in-the-loop Review
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Extracted Data Form */}
                    <div className="glass p-8 rounded-[32px] border border-white/10 space-y-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <CheckCircle size={20} className="text-primary" />
                            </div>
                            <h2 className="text-xl font-bold">Extracted Summary</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Patient Identity</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 text-white font-medium focus:border-primary outline-none transition-all"
                                    defaultValue={claimData.patientName}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Provider Hospital</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 text-white font-medium focus:border-primary outline-none transition-all"
                                    defaultValue={claimData.providerName}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Provider Wallet (On-Chain)</label>
                                <div className="flex space-x-2">
                                    <input
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 text-success font-mono text-sm focus:border-success outline-none transition-all"
                                        defaultValue={claimData.providerWallet || "0x742d...44e"}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <h3 className="text-xs uppercase font-bold text-slate-500 tracking-widest mb-4">Service Line Items</h3>
                            <div className="space-y-3">
                                {claimData.services?.map((s: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                        <div className="text-sm">
                                            <div className="font-bold">{s.name}</div>
                                            <div className="text-xs text-slate-500 font-mono">{s.code}</div>
                                        </div>
                                        <div className="font-bold text-primary">₹{s.amount}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Settlement Action */}
                    <div className="space-y-8">
                        <div className="glass p-8 rounded-[32px] border border-primary/20 bg-primary/[0.02] space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <CreditCard size={100} />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black italic tracking-tighter">Settlement Status</h3>
                                <div className="mt-8 space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-slate-500 font-medium">Total Payable</span>
                                        <span className="text-5xl font-black text-white">₹{claimData.totalPayable}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Confidence Score</span>
                                        <span className="text-success font-black">{(claimData.confidenceScore * 100).toFixed(1)}%</span>
                                    </div>
                                </div>

                                <div className="pt-10 space-y-4">
                                    {!walletAddress ? (
                                        <button
                                            onClick={connectWallet}
                                            className="w-full py-5 gradient-primary text-black font-black rounded-2xl hover:scale-105 transition-all shadow-xl flex items-center justify-center space-x-3"
                                        >
                                            <LinkIcon size={20} />
                                            <span>Link MetaMask Wallet</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handlePayment}
                                            disabled={isPaying}
                                            className="w-full py-5 bg-white text-black font-black rounded-2xl hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all shadow-xl flex items-center justify-center space-x-3"
                                        >
                                            {isPaying ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
                                            <span>{isPaying ? "Authorizing Payment..." : "Settle via MNEE Token"}</span>
                                        </button>
                                    )}
                                    <p className="text-[10px] text-center text-slate-500 uppercase font-bold tracking-widest">
                                        Authorized by Digital Auth Protocol v2
                                    </p>
                                </div>
                            </div>
                        </div>

                        {txHash && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-6 rounded-2xl border border-success/30 bg-success/5"
                            >
                                <div className="flex items-center space-x-3 text-success font-bold text-sm mb-2">
                                    <CheckCircle size={16} />
                                    <span>Transaction Broadcast Successful</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <code className="text-xs text-slate-500 truncate max-w-[200px]">{txHash}</code>
                                    <a
                                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                                        target="_blank"
                                        className="text-primary text-xs font-bold flex items-center space-x-1 hover:underline"
                                    >
                                        <span>Explorer</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function ReviewPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-primary font-bold">Initializing Review Agent...</div>}>
            <ReviewContent />
        </Suspense>
    );
}
