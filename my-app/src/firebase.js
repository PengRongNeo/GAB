import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"; // Import sendPasswordResetEmail
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc, getDocs, increment, addDoc} from "firebase/firestore";
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
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app); // Optional Analytics

// Firestore utility functions
const getCartFromFirestore = async (userId) => {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data().cart || [];
  }
  return [];
};

const updateCartInFirestore = async (userId, cart) => {
  const userDocRef = doc(db, "users", userId);
  
  try {
    await updateDoc(userDocRef, {
      cart: cart
    });
    console.log("Cart updated successfully!");
  } catch (error) {
    console.error("Error updating cart: ", error);
  }
};

// Function to send password reset email
export const sendPasswordReset = async (email) => {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent successfully!');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error; // You can throw the error to be handled where it's called
  }
};

// In firebase.js
export const updateWalletBalance = async (userId, newBalance) => {
  try {
    // Create a reference to the user's document
    const userRef = doc(db, "users", userId);
    
    // Update the wallet field with the new balance
    await updateDoc(userRef, {
      wallet: newBalance,
    });

    console.log("Wallet balance updated successfully");
  } catch (error) {
    console.error("Error updating wallet balance: ", error);
  }
};

// Fetch user's wallet balance
export const getUserWalletBalance = async (uid) => {
  const currentUser = auth.currentUser; // Get the current authenticated user
  if (currentUser) {
    try {
      const userRef = doc(db, "users", currentUser.uid); // Reference to the user's document in Firestore
      const userDoc = await getDoc(userRef); // Fetch the document
      
      if (userDoc.exists()) {
        // Return the wallet balance or 0 if the wallet field is not available
        return userDoc.data().wallet || 0;
      } else {
        console.error("User document does not exist");
        return 0; // Return 0 if user document doesn't exist
      }
    } catch (error) {
      console.error("Error getting user wallet balance:", error);
      return 0; // Return 0 in case of error
    }
  } else {
    console.error("No authenticated user found");
    return 0; // Return 0 if there's no authenticated user
  }
};




// Export all the necessary services and functions
export {
  auth,
  db,
  analytics,
  doc,
  updateDoc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getCartFromFirestore,
  updateCartInFirestore,
  setDoc,
  getDoc,
  getDocs,
  collection,
  increment,
  addDoc
};
