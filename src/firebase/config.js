// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBV6LNocaaXlPxVlaM8Jz3IbxXnG2uh-Vs",
  authDomain: "glemora.firebaseapp.com",
  projectId: "glemora",
  storageBucket: "glemora.firebasestorage.app",
  messagingSenderId: "273221037182",
  appId: "1:273221037182:web:eb945d566daf2007803c2f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };