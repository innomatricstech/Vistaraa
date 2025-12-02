import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtraD4VRw_kJsltygAqzKtcYdyfnLeHZk",
  authDomain: "sadhana-cart.firebaseapp.com",
  projectId: "sadhana-cart",
  storageBucket: "sadhana-cart.appspot.com", 
  messagingSenderId: "126398142924",
  appId: "1:126398142924:web:9ff3415ca18ad24b85a569",
  measurementId: "G-GQ40SLFB85"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
