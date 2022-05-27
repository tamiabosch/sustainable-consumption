import { auth } from "./firebaseConfig";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

import {
  useState,
  useContext,
  createContext,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { useHistory } from 'react-router-dom';


type AuthContextType = {
  loading: boolean
  loggedIn: boolean
  loginUser: (email: string, password: string) => any
  logoutUser: () => void
  signIn: (user: any) => void
  token: string
  // resetPassword:(email:any)=>{}
  // updateEmail:(email:any)=>{}
  // updatePassword:(password:any)=>{}
}
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {

  const [loading, setLoading] = useState(true);
  //'FirebaseAuthTypes'-> User

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState(localStorage.getItem(`token`) || '');

  const loggedIn = useMemo(() => (token ? true : false), [token]);
  const history = useHistory();



  //login User
  async function loginUser(email: string, password: string) {
    try {
      const data = (await signInWithEmailAndPassword(auth, email, password)).user;
      const { refreshToken } = data;
      console.log("refreshToken: " + refreshToken);
      console.log("data: " + data);
      return data;
    } catch (e) {
      console.error("Error in Registering customer ", e);
      return { error: e, message: "Error in Registering customer" };
    }
  }
  const signIn = (user: User) => {
    setUser(user);
    const { refreshToken } = user;
    setToken(refreshToken);
    localStorage.setItem(`token`, refreshToken);
    console.log("signIn User:", user);
  };
  //logout User
  const logoutUser = useCallback(() => {
    signOut(auth);
    setToken('');
    setUser(null);
  }, []);

  useEffect(() => {
    let isMounted = true
    async function loadUser() {
      setLoading((loading) => loading = true);
      auth.onAuthStateChanged(function (user) {

        if (user) {
          // User is signed in.
          if (isMounted) setUser(user);
          console.log("Auth useEffect: " + user.refreshToken)
          if (isMounted) setToken(user.refreshToken);
          if (isMounted) setLoading((loading) => loading = false);
        } else {
          if (isMounted) setLoading((loading) => loading = false)
          logoutUser();
        }
      });
    }
    if (token) {
      console.log('Auth loadUser: ' + token);
      loadUser();
    }
    if (isMounted) setLoading((loading) => loading = false);
    console.log("Auth useEffect: " + loggedIn)
    return () => { isMounted = false };
  }, [token, logoutUser, loggedIn]);

  //unsubscribe from auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  //values that AuthContext provides
  const value = {
    loading,
    loggedIn,
    loginUser,
    logoutUser,
    signIn,
    token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export default AuthProvider;

export function useAuth() {
  return useContext<AuthContextType>(AuthContext);
}

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

