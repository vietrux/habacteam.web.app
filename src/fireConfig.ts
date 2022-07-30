import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5mbqQagjiZLLOWiVxvM0cbvhsrRKEKto",
  authDomain: "habacteam.firebaseapp.com",
  projectId: "habacteam",
  storageBucket: "habacteam.appspot.com",
  messagingSenderId: "809956718536",
  appId: "1:809956718536:web:d7f0ad4d53c8cb735432fd",
  measurementId: "G-P5Q1FW3554"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };