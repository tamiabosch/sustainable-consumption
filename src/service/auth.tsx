import { auth, db, provider } from "./firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

import {
  useState,
  useContext,
  createContext,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  loading:boolean
  loggedIn:boolean
  loginUser:(email:string, password:string)=> any
  logoutUser:()=>void
  signIn: (user:any)=>void
  // resetPassword:(email:any)=>{}
  // updateEmail:(email:any)=>{}
  // updatePassword:(password:any)=>{}
}
const AuthContext =  createContext<AuthContextType>({} as AuthContextType);
export const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');
  const loggedIn = useMemo(() => ( user ? true : false), [user]);
  const navigate = useNavigate();

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
      const data = (await signInWithEmailAndPassword(auth, email, password)).user;
      const { uid } = data;
      return data;
    } catch (e) {
      console.error("Error in Registering customer ", e);
    }
  }
  const signIn = (user: any) => {
    setUser(user);
    console.log("Signed in:", user.email);
  };
  //logout User
  const logoutUser = useCallback(() => {
    signOut(auth);
    setUser('');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    async function loadUser() {
      const data = auth.currentUser
      if (data) {
        console.log(data.uid);
        setUser(data.uid);
      } else {
        logoutUser();
      }
    }
    if (user) {
      loadUser();
    }

  }, [user,  logoutUser]);

  //unsubscribe from auth state changes
  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user: any) => {
  //     setLoading(false);
  //   });
  //   return unsubscribe;
  // }, []);

  //values that AuthContext provides
  const value = { 
    loading, 
    loggedIn, 
    loginUser,
    logoutUser, 
    signIn 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export default AuthProvider;

export function useAuth() {
  return useContext<AuthContextType>(AuthContext);
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
