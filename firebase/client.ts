// client.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBghWBrqf4gxLQKT0vKQ-X4RhLp0BNjm_I",
  authDomain: "prep-b209c.firebaseapp.com",
  projectId: "prep-b209c",
  storageBucket: "prep-b209c.firebasestorage.app",
  messagingSenderId: "880502238820",
  appId: "1:880502238820:web:2c9d78d009061472b6b971"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
