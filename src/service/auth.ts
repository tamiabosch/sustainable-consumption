import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";


  
export async function loginUser(mail: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, mail, password)
    .then((userCredential) => {
      // Signed in     
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
    return true
  } catch (err) {
    console.log("sign in error", err);
    console.error(err);
    return false
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
// export const authCheck = async (_handleAuthedUser: any) => {
//   return new Promise((resolve) => {
//     // Listen for authentication state to change.
//     auth.onAuthStateChanged(async (user) => {
//       if (user != null) {
//         console.log("We are authenticated now!");
//         console.log(user);
//         return resolve(await _handleAuthedUser(user));
//       } else {
//         console.log("We did not authenticate.");
//         _handleAuthedUser(null);
//         return resolve(null);
//       }
//     });
//   });
// };

// export async function authListener() {
//   auth.onAuthStateChanged((user) => {
//     if (user) {
//       clearInputs();
//       setUser(user);
//     } else {
//       setUser("");
//     }
//   });
// };

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
