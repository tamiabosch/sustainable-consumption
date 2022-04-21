// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  //TODO databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function loginUser(mail: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, mail, password);
  } catch (err) {
    console.log("sign in error", err);
    console.error(err);
  }
}

export async function getCurrentUser() {
  return auth.currentUser; 
}

/**
 * so this function is called when the authentication state changes
 * in the application, a side effect of that is that we need to get
 * the rest of the user data from the user collection, that is
 * done with the _handleAuthedUser callback
 */
export const authCheck = async (_handleAuthedUser: any) => {
  return new Promise((resolve) => {
    // Listen for authentication state to change.
    auth.onAuthStateChanged(async (user) => {
      if (user != null) {
        console.log("We are authenticated now!");

        return resolve(await _handleAuthedUser(user));
      } else {
        console.log("We did not authenticate.");
        _handleAuthedUser(null);
        return resolve(null);
      }
    });
  });
};

export async function logout() {
  try {
    await signOut(auth);
    console.log("logged out");
    console.log(auth.currentUser);
    console.log(getCurrentUser());
  } catch (err) {
    console.error(err);
  }
}