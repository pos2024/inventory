
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLqWIWBpY8MvdprCHWKdm4E1w_084DQcs",
  authDomain: "inventory-59d0b.firebaseapp.com",
  projectId: "inventory-59d0b",
  storageBucket: "inventory-59d0b.firebasestorage.app",
  messagingSenderId: "384431029855",
  appId: "1:384431029855:web:1eca6e78e2b4efe4d725ea"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore=getFirestore(app);
export { app, firestore };
const db = firestore;
export default db;