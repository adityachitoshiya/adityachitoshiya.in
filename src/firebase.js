// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiFWE_TBs_7Wy4nt5U1d_Tp3MV1F-_XJQ",
  authDomain: "portfolio-74034.firebaseapp.com",
  projectId: "portfolio-74034",
  storageBucket: "portfolio-74034.firebasestorage.app",
  messagingSenderId: "163414516942",
  appId: "1:163414516942:web:d4a523b8e92ed23a501c9f",
  measurementId: "G-4M1PQWX332"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
