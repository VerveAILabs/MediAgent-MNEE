"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ProcessingStatus, StatusStep } from "@/components/ProcessingStatus";
import { useAuth } from "@/lib/firebase/AuthProvider";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Link as LinkIcon, LogOut } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
    const { user, loading, walletAddress, connectWallet, signOut } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState<StatusStep | null>(null);
    const [result, setResult] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    const handleUpload = async (file: File) => {
        setIsProcessing(true);
        setStatus("EXTRACTING");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Processing failed");

            const data = await response.json();
            setResult(data);
            setStatus("COMPLETED");

            // After extraction, redirect to review page after a short delay
            setTimeout(() => {
                router.push(`/review?id=${data.claimId}`);
            }, 3000);
        } catch (error) {
            console.error(error);
            setStatus("FAILED");
            setIsProcessing(false);
        }
    };

    if (loading || !user) return null;

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Mini Nav / Header */}
            <header className="px-6 py-6 flex justify-between items-center border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center space-x-6">
                    <Link href="/" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <ArrowLeft size={20} className="text-slate-400" />
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight">Initiate New Claim</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={connectWallet}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${walletAddress
                            ? "bg-success/20 text-success border border-success/30"
                            : "bg-primary text-black hover:scale-105"
                            }`}
                    >
                        <LinkIcon size={16} />
                        <span>{walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : "Connect MetaMask"}</span>
                    </button>

                    <div className="h-8 w-[1px] bg-white/10" />

                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <User size={16} className="text-slate-400" />
                        </div>
                        <button onClick={signOut} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-error transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 px-6 py-12 flex flex-col items-center justify-center max-w-7xl mx-auto w-full">
                {!status ? (
                    <div className="w-full space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Secure Transmission</h2>
                            <p className="text-slate-400 font-medium">Upload your medical documents for autonomous analysis.</p>
                        </div>
                        <FileUpload onUpload={handleUpload} isProcessing={isProcessing} />
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="text-center mb-12 space-y-2">
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Agent in Motion</h2>
                            <p className="text-slate-400 font-medium">Navigating Indian billing stacks and verifying credentials.</p>
                        </div>
                        <ProcessingStatus status={status} details={result} />
                        {status === "COMPLETED" && (
                            <div className="mt-8 text-center text-primary animate-pulse font-tech text-sm uppercase tracking-widest">
                                Extraction Complete. Redirecting to Human Review...
                            </div>
                        )}
                    </div>
                )}
            </div>

            <footer className="py-8 px-6 text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest">
                End-to-end encrypted claim session • HIPAA Compliant
            </footer>
        </main>
    );
}
