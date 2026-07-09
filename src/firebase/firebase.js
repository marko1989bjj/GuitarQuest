// Firebase App
import { initializeApp } from "firebase/app";

// Firebase Authentication
import { getAuth } from "firebase/auth";

// Cloud Firestore
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7yyYrqeSDrEpP-KAKG-A35UGlrkGyQVk",
  authDomain: "guitarquest-ac0e9.firebaseapp.com",
  projectId: "guitarquest-ac0e9",
  storageBucket: "guitarquest-ac0e9.firebasestorage.app",
  messagingSenderId: "175436273997",
  appId: "1:175436273997:web:4c55a73420f3de2a5e3f04",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export services
export { auth, db };
