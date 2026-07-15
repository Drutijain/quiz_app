import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


  // Replace with your Firebase config
  const firebaseConfig = {
  apiKey: "AIzaSyDgUntVEATQ0x5_MAN5PV07XuklpgiGn4o",
  authDomain: "quiz-app-5d4c8.firebaseapp.com",
  projectId: "quiz-app-5d4c8",
  storageBucket: "quiz-app-5d4c8.firebasestorage.app",
  messagingSenderId: "429324495937",
  appId: "1:429324495937:web:e6d738ad0f15b9056faac0"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };