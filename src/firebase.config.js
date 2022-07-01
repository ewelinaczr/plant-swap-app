// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// Firestore added
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0StWAr2iaPbTi_HjBfNR50PLIonti3kk",
  authDomain: "plant-app-628bb.firebaseapp.com",
  projectId: "plant-app-628bb",
  storageBucket: "plant-app-628bb.appspot.com",
  messagingSenderId: "149113202491",
  appId: "1:149113202491:web:8b4bebdff852808ed9391e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore()