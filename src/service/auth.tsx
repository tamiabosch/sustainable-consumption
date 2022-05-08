import { auth, db, provider } from "./firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

import {
  useState,
  useContext,
  createContext,
  useMemo,
  useEffect,
  SetStateAction,
} from 'react';
type AuthContextType = {
  loading:boolean
  loggedIn:boolean
  loginUser:(email:string, password:string)=>{}
  logout:()=>{}
  signIn: (user:any)=>void
  // resetPassword:(email:any)=>{}
  // updateEmail:(email:any)=>{}
  // updatePassword:(password:any)=>{}

}
const AuthContext =  createContext<AuthContextType>({} as AuthContextType);
export const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');

  //add UserData to DB
  // const addData = async (
  //   dbname: string,
  //   data: { name: any; email: any; uid: string; creationTime: any }
  // ) => {
  //   try {
  //     const docRef = await addDoc(collection(db, dbname), data);
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // };

  //login User
  async function loginUser(email: string, password: string) {
    try {
      const data = (await signInWithEmailAndPassword(auth, email, password))
        .user;
      const { uid } = data;
      //localStorage.setItem("LoggedIn", JSON.stringify(uid));
      setUser(uid);
      return data;
    } catch (e) {
      console.error("Error in Registering customer ", e);
    }
  }

  //safe login data
  // const signInData = (user: any) => {
  //   setUser(user);
  //   localStorage.setItem(`userid`, user);
  //   //history.push(`/`);
  //   //lets to a redirect
  // };
  function signIn (user: any){
    setUser(user);
    // localStorage.setItem(`userid`, user.id);
    console.log("Signed in:", user.email);
  };
  //logout User
  function logout() {
    localStorage.removeItem("LoggedIn");
    return signOut(auth);
  }

  const loggedIn = useMemo(() => ( user ? true : false), [user]);

  
  //unsubscribe from auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  //values that AuthContext provides
  const value = { loading, loggedIn, loginUser, logout, signIn };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export default AuthProvider;

export function useAuth() {
  return useContext<AuthContextType>(AuthContext);
}


  
export async function loginUserMail(mail: string, password: string) {
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
export const authCheck = async (_handleAuthedUser: any) => {
  return new Promise((resolve) => {
    // Listen for authentication state to change.
    auth.onAuthStateChanged(async (user) => {
      if (user != null) {
        console.log("We are authenticated now!");
        console.log(user);
        return resolve(await _handleAuthedUser(user));
      } else {
        console.log("We did not authenticate.");
        _handleAuthedUser(null);
        return resolve(null);
      }
    });
  });
};

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
