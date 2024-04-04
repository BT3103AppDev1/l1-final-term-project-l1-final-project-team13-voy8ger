// USING WEB MODULAR APPROACH
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDaIzx5nC7DghZUbYreZGRrUB2AnVHODcQ",
  authDomain: "voy8ger-da2af.firebaseapp.com",
  projectId: "voy8ger-da2af",
  storageBucket: "voy8ger-da2af.appspot.com",
  messagingSenderId: "353059118922",
  appId: "1:353059118922:web:a5de1839421f17ada76bb3",
  measurementId: "G-JKWY7RDCDR",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
