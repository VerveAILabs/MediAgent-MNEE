"use client";

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, Circle, Loader2, CreditCard, Brain, ShieldCheck, Terminal, ArrowRight, Share2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type StatusStep = "EXTRACTING" | "VALIDATING" | "ORCHESTRATING" | "COMPLETED" | "FAILED";

interface ProcessingStatusProps {
    status: StatusStep;
    details?: any;
}

const LOG_MESSAGES: Record<StatusStep, string[]> = {
    EXTRACTING: [
        "Establishing secure connection to Gemini 2.0 Flash cluster...",
        "Scanning medical document for structural markers...",
        "OCR pipeline active: Identifying Provider and Patient coordinates...",
        "Extracting CPT/ICD-10 codes from billing table...",
        "Cross-referencing extracted amounts for mathematical consistency...",
    ],
    VALIDATING: [
        "Initializing Medical Validation Engine v4.2...",
        "Verifying provider credentials against registered database...",
        "Applying coverage rules: 80% procedural co-insurance detected...",
        "Checking procedure codes against global ICD-10 whitelist...",
        "Calculating final payable amount: Deducting non-covered items...",
    ],
    ORCHESTRATING: [
        "Preparing MNEE Smart Contract payload...",
        "Estimating gas for claim submission on Ethereum...",
        "Broadcasting transaction to network via Infura RPC...",
        "Mempool detection: Transaction pending confirmation...",
        "Awaiting block finality for MNEE disbursement...",
    ],
    COMPLETED: [
        "Execution finalized successfully.",
        "Blockchain state sync complete.",
        "Receipt generated and archived.",
    ],
    FAILED: [
        "Error detected during processing.",
        "Reverting secure session...",
    ],
};

export function ProcessingStatus({ status, details }: ProcessingStatusProps) {
    const [logs, setLogs] = useState<string[]>([]);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (status) {
            const currentLogs = LOG_MESSAGES[status] || [];
            let i = 0;
            const interval = setInterval(() => {
                if (i < currentLogs.length) {
                    setLogs(prev => [...prev, currentLogs[i]]);
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 800);
            return () => clearInterval(interval);
        }
    }, [status]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const steps = [
        { id: "EXTRACTING", label: "AI Doc Extraction", icon: Brain, color: "text-cyan-400" },
        { id: "VALIDATING", label: "Medical Guardrail", icon: ShieldCheck, color: "text-violet-400" },
        { id: "ORCHESTRATING", label: "MNEE Payment", icon: CreditCard, color: "text-pink-400" },
    ];

    const getStepStatus = (id: string) => {
        const statusOrder = ["EXTRACTING", "VALIDATING", "ORCHESTRATING", "COMPLETED"];
        const currentIndex = statusOrder.indexOf(status);
        const stepIndex = statusOrder.indexOf(id);

        if (status === "FAILED" && id === statusOrder[currentIndex]) return "failed";
        if (currentIndex > stepIndex || status === "COMPLETED") return "completed";
        if (currentIndex === stepIndex) return "processing";
        return "pending";
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            {/* Left Column: Visual Steps */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold font-tech uppercase tracking-widest text-slate-500 mb-6 flex items-center">
                    <Share2 size={18} className="mr-2" />
                    Execution Pipeline
                </h3>

                {steps.map((step) => {
                    const stepStatus = getStepStatus(step.id);
                    const Icon = step.icon;

                    return (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-6 rounded-2xl glass transition-all duration-500 ${stepStatus === "processing" ? "ring-2 ring-primary/50 bg-primary/5" : ""
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-4 rounded-xl ${stepStatus === "completed" ? "bg-success/20 text-success" :
                                            stepStatus === "processing" ? "bg-primary/20 text-primary" : "bg-white/5 text-slate-600"
                                        }`}>
                                        <Icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-bold ${stepStatus === "pending" ? "text-slate-600" : "text-white"}`}>
                                            {step.label}
                                        </h4>
                                        <p className="text-sm text-slate-400">
                                            {stepStatus === "completed" ? "Agent verification successful" :
                                                stepStatus === "processing" ? "Analyzing with Gemini 2.0..." : "Awaiting upstream data"}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative">
                                    {stepStatus === "completed" && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                            <CheckCircle2 className="text-success" size={28} />
                                        </motion.div>
                                    )}
                                    {stepStatus === "processing" && (
                                        <div className="flex space-x-1">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ opacity: [0, 1, 0] }}
                                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                                    className="w-2 h-2 rounded-full bg-primary"
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {stepStatus === "pending" && <Circle className="text-slate-800" size={28} />}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Right Column: Agent Mind & Receipt */}
            <div className="space-y-8">
                <div className="glass rounded-3xl overflow-hidden flex flex-col h-[320px] lg:h-[400px]">
                    <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Terminal size={16} className="text-primary" />
                            <span className="text-xs font-bold font-tech text-slate-400 uppercase">Agent Logic Stream</span>
                        </div>
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                        </div>
                    </div>

                    <div className="p-6 font-tech text-sm text-slate-300 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start"
                            >
                                <span className="text-primary mr-3 shrink-0">›</span>
                                <span className={i === logs.length - 1 ? "text-primary animate-pulse" : ""}>{log}</span>
                            </motion.div>
                        ))}
                        <div ref={logEndRef} />
                    </div>
                </div>

                {/* Final Receipt Card */}
                <AnimatePresence>
                    {status === "COMPLETED" && details && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", damping: 15 }}
                            className="p-8 rounded-3xl bg-gradient-to-br from-success/10 to-transparent border border-success/30 glass relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 rotate-12">
                                <CheckCircle2 size={80} className="text-success opacity-10" />
                            </div>

                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-3xl font-black text-white italic tracking-tighter">SUCCESS</h3>
                                    <p className="text-success font-bold text-xs uppercase tracking-widest">Transaction Verified</p>
                                </div>
                                <div className="p-2 bg-success rounded-lg">
                                    <ExternalLink size={20} className="text-black" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 bg-black/40 p-6 rounded-2xl border border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payable Disbursed</p>
                                    <p className="text-2xl font-black font-tech text-white">${details.totalPayable.toFixed(2)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">MNEE Payload ID</p>
                                    <p className="text-sm font-tech text-primary truncate">{details.claimId || "CLAIM_8842"}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col space-y-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Confirmation Hash</p>
                                <p className="text-[10px] font-tech text-slate-400 break-all bg-white/5 p-3 rounded-lg border border-white/5">
                                    {details.txHash}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
