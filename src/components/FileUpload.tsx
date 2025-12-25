"use client";

import React, { useState, useCallback } from "react";
import { Upload, FileText, Sparkles, FileUp, ShieldCheck } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
    onUpload: (file: File) => void;
    isProcessing: boolean;
}

export function FileUpload({ onUpload, isProcessing }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            onUpload(acceptedFiles[0]);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "image/*": [".png", ".jpg", ".jpeg"],
        },
        multiple: false,
        disabled: isProcessing,
    });

    return (
        <div className="w-full max-w-3xl mx-auto px-4">
            <div {...getRootProps()} className="relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`relative group cursor-pointer rounded-3xl overflow-hidden transition-all duration-500
                        ${isDragActive ? "scale-105" : "hover:scale-[1.02]"}
                        ${isProcessing ? "pointer-events-none opacity-80" : ""}
                        glass border-glow`}
                >
                    <input {...getInputProps()} />

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Sparkles className="text-secondary" size={48} />
                    </div>

                    <div className="relative z-10 p-16 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="relative">
                            <motion.div
                                animate={isProcessing ? { rotate: 360 } : {}}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity"
                            />
                            <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 text-primary group-hover:text-white transition-colors">
                                {file ? <FileText size={40} /> : <FileUp size={40} />}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-3xl font-bold tracking-tight">
                                {file ? file.name : "Initiate AI Agent Analysis"}
                            </h3>
                            <p className="text-slate-400 text-lg max-w-md mx-auto">
                                Securely transmit your medical bill. Our agent will perform real-time extraction and validation.
                            </p>
                        </div>

                        <div className="flex items-center space-x-6 pt-4 text-sm font-medium text-slate-500">
                            <div className="flex items-center space-x-2">
                                <ShieldCheck size={18} className="text-success" />
                                <span>HIPAA Compliant</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span>Gemini 2.0 Real-time</span>
                            </div>
                        </div>
                    </div>

                    {/* Upload progress overlay */}
                    <AnimatePresence>
                        {isProcessing && (
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent z-20"
                            />
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex justify-center items-center space-x-8 text-slate-600 grayscale opacity-50">
                <span className="font-bold tracking-widest text-xs uppercase">Ethers.js</span>
                <span className="font-bold tracking-widest text-xs uppercase">Google Gemini</span>
                <span className="font-bold tracking-widest text-xs uppercase">Ethereum</span>
            </div>
        </div>
    );
}
