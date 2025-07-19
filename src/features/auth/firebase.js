// src/features/auth/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAZn7T9y3308cKgMbwV3wb_eW91RvWZQh4",
  authDomain: "resume-portfolio-673f6.firebaseapp.com",
  projectId: "resume-portfolio-673f6",
  storageBucket: "resume-portfolio-673f6.appspot.com",
  messagingSenderId: "522641316422",
  appId: "1:522641316422:web:b067ded5cdba2ebde24847"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
