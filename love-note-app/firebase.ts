import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmME4Ve08Y8jGJvKoYeT3pFWH_2mp7UZE",
  authDomain: "love-note-app-c5b29.firebaseapp.com",
  projectId: "love-note-app-c5b29",
  storageBucket: "love-note-app-c5b29.firebasestorage.app",
  messagingSenderId: "376622964616",
  appId: "1:376622964616:web:25bb5e29b5f39792bd243d",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
