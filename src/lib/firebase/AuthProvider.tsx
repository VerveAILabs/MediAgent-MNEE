"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    User,
    signOut as firebaseSignOut
} from "firebase/auth";
import { auth, db } from "./config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ethers } from "ethers";

interface AuthContextType {
    user: User | null;
    walletAddress: string | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    connectWallet: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth || !db) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                // Fetch linked wallet from Firestore
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                if (userDoc.exists()) {
                    setWalletAddress(userDoc.data().walletAddress || null);
                }
            } else {
                setWalletAddress(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // Initialize user doc if it doesn't exist
            const userRef = doc(db, "users", result.user.uid);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: result.user.email,
                    displayName: result.user.displayName,
                    createdAt: new Date(),
                });
            }
        } catch (error) {
            console.error("Google Sign-in failed", error);
        }
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const address = accounts[0];

            if (user) {
                // Link wallet to authenticated user
                await updateDoc(doc(db, "users", user.uid), {
                    walletAddress: address,
                });
                setWalletAddress(address);
            }
        } catch (error) {
            console.error("Wallet connection failed", error);
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        setUser(null);
        setWalletAddress(null);
    };

    return (
        <AuthContext.Provider value={{ user, walletAddress, loading, signInWithGoogle, connectWallet, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Extend window for Ethereum
declare global {
    interface Window {
        ethereum?: any;
    }
}
