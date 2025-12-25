import * as admin from "firebase-admin";

if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey: privateKey.replace(/\\n/g, "\n"),
                }),
            });
        } catch (error) {
            console.error("Firebase admin initialization error", error);
        }
    } else {
        console.warn("Firebase Admin environment variables missing. Skipping initialization.");
    }
}

const createLazyProxy = (getter: () => any, name: string) => {
    return new Proxy({}, {
        get: (target, prop) => {
            const obj = getter();
            if (!obj) {
                console.warn(`Accessing ${name}.${String(prop)} during build or without initialization.`);
                // Return a no-op function or dummy object to prevent build-time crashes
                return () => ({
                    doc: () => ({ set: () => { }, update: () => { }, get: () => ({ exists: () => false }) }),
                    collection: () => ({ doc: () => ({ set: () => { }, update: () => { }, get: () => ({ exists: () => false }) }) }),
                });
            }
            return obj[prop];
        }
    }) as any;
};

export const getAdminAuth = () => {
    if (!admin.apps.length) return null;
    return admin.auth();
};

export const getAdminDb = () => {
    if (!admin.apps.length) return null;
    return admin.firestore();
};

// For backward compatibility (not recommended for build-safe files but needed if already used)
export const adminAuth = createLazyProxy(() => (admin.apps.length ? admin.auth() : null), "adminAuth");
export const adminDb = createLazyProxy(() => (admin.apps.length ? admin.firestore() : null), "adminDb");
