// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, initializeAuth, indexedDBLocalPersistence } from "firebase/auth";

import { Capacitor } from "@capacitor/core";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


// Import Admin SDK
const { getDatabase } = require('firebase/database');

// Get a database reference to our blog
export const realtimeDB = getDatabase();
export const db = getFirestore();

function whichAuth() {
  let auth
  if (Capacitor.isNativePlatform()) {
    auth = initializeAuth(app, {
      persistence: indexedDBLocalPersistence
    })
  } else {
    auth = getAuth()
  }
  return auth
}
export const auth = whichAuth() //getAuth(app);

export const provider = new GoogleAuthProvider();


export const createGroceryList = (userName: string) => {
  const groceriesColRef = collection(db, 'groceryLists')
  return addDoc(groceriesColRef, {
          created: serverTimestamp(),
          users: [{ name: userName }]
      });
};