import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyC0eZv9VS7kfMtPD65xWA3BoJf-4iUEkAw",
  authDomain: "nmu-hockey-recruiting.firebaseapp.com",
  projectId: "nmu-hockey-recruiting",
  storageBucket: "nmu-hockey-recruiting.firebasestorage.app",
  messagingSenderId: "975029343366",
  appId: "1:975029343366:web:a0b69d0b57913aa0aded07",
  measurementId: "G-YV6ZHXD31R"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
