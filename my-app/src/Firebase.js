// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQczYQ5v0uwU6B6KghqVY_KYKFWf1SPG4",
  authDomain: "gab-75104.firebaseapp.com",
  projectId: "gab-75104",
  storageBucket: "gab-75104.appspot.com", // 🔹 FIXED
  messagingSenderId: "746536901618",
  appId: "1:746536901618:web:5a0bc9e328125f5ea4296b",
  measurementId: "G-NK3FS9N5WV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // Firebase Authentication
const db = getFirestore(app); // Firestore Database
const analytics = getAnalytics(app); // Optional Analytics

// Export the services for use in other files
export { auth, db };


// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app); // Optional Analytics

// Export the services and functions for use in other files
export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword };
