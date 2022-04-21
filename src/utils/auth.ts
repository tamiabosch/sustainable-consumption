import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDm8IHkhPoND6IKwl_XUFQPaZNDwxuwau8",
    authDomain: "sustainable-consumption-ionic.firebaseapp.com",
    projectId: "sustainable-consumption-ionic",
    storageBucket: "sustainable-consumption-ionic.appspot.com",
    messagingSenderId: "915855017472",
    appId: "1:915855017472:web:63bd5a754586d8d5cd7ae5",
    measurementId: "G-Q00BGCTZ5E"
  };

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
  
export async function logout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
}