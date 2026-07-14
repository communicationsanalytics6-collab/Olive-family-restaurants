import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD4SyBClDbsNH5GeusIKCBvGUGmLQ_l8Dg",
  authDomain: "gen-lang-client-0888070656.firebaseapp.com",
  projectId: "gen-lang-client-0888070656",
  storageBucket: "gen-lang-client-0888070656.firebasestorage.app",
  messagingSenderId: "932353521060",
  appId: "1:932353521060:web:1865b205c3713500c77d31"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-olivefamilyresta-8b72dcba-93e0-40fe-834f-82be25d6fde3");
