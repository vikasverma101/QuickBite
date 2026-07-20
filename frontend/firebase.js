// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
 apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "foodwalla-2efba.firebaseapp.com",
  projectId: "foodwalla-2efba",
  storageBucket: "foodwalla-2efba.firebasestorage.app",
  messagingSenderId: "299986423454",
  appId: "1:299986423454:web:3741e6e8efdb9b5cba758f",
  measurementId: "G-0YV4GYFXZ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}