import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDqAOeKXTjHR-zk6uLaUjQ-FZRAYjKfKi8",
  authDomain: "codepth-chat-app-mj.firebaseapp.com",
  projectId: "codepth-chat-app-mj",
  storageBucket: "codepth-chat-app-mj.appspot.com",
  messagingSenderId: "703263868629",
  appId: "1:703263868629:web:da33c92321daa22e8e045c",
  measurementId: "G-YHHG3NL1SB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();

export const provider = new GoogleAuthProvider()