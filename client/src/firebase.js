// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-a4977.firebaseapp.com",
  projectId: "mern-estate-a4977",
  storageBucket: "mern-estate-a4977.appspot.com",
  messagingSenderId: "534512213642",
  appId: "1:534512213642:web:18d5a1a90ca0d9163d9773"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig); 