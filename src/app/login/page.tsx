"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/lib/firebase/AuthProvider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Cpu, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const { user, signInWithGoogle, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && !loading) {
            router.push("/upload");
        }
    }, [user, loading, router]);

    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary opacity-10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary opacity-10 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass p-10 rounded-[40px] border border-white/10 text-center space-y-8 shadow-2xl relative z-10"
            >
                <div className="flex justify-center">
                    <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center p-4 glow-primary">
                        <Cpu size={48} className="text-black" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter">Welcome to <span className="text-primary italic">MediClaimAI</span></h1>
                    <p className="text-slate-400 font-medium">Secure Google Sign-in required to access patient claims and settlement tools.</p>
                </div>

                <button
                    onClick={signInWithGoogle}
                    disabled={loading}
                    className="w-full py-4 px-6 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all flex items-center justify-center space-x-3 shadow-lg group"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                    <span>Continue with Google</span>
                </button>

                <div className="pt-6 border-t border-white/5 flex items-center justify-center space-x-2 text-slate-500 text-sm">
                    <ShieldCheck size={16} className="text-success" />
                    <span>HIPAA & GDPR Compliant Infrastructure</span>
                </div>
            </motion.div>
        </main>
    );
}
