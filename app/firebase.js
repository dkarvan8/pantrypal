// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCjuq8Vgl2Suw5tatDyIMixOmU4QdPB_x4",
  authDomain: "pantrypal-9e4b3.firebaseapp.com",
  projectId: "pantrypal-9e4b3",
  storageBucket: "pantrypal-9e4b3.appspot.com",
  messagingSenderId: "361084565764",
  appId: "1:361084565764:web:dade571785dcb65ad5f851",
  measurementId: "G-EJ81CGPYW9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const firestore = getFirestore(app);





