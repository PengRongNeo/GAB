// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQczYQ5v0uwU6B6KghqVY_KYKFWf1SPG4",
  authDomain: "gab-75104.firebaseapp.com",
  projectId: "gab-75104",
  storageBucket: "gab-75104.firebasestorage.app",
  messagingSenderId: "746536901618",
  appId: "1:746536901618:web:5a0bc9e328125f5ea4296b",
  measurementId: "G-NK3FS9N5WV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);