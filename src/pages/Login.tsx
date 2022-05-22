import React, { useState } from "react";
import {
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonPage,
  IonContent,
} from "@ionic/react";
import { useAuth } from "../service/auth";
import { db, createGroceryList, auth } from "../service/firebaseConfig";
import { signInWithEmailAndPassword  } from "firebase/auth";
import { Redirect } from "react-router";


//Use one which works fine for you 


const Login: React.FC = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  //TODO 
  // add Logic if empty 
  // add error toast message, if input is wrong
  // invalid mail
  //add Toast on success
  const { signIn, loginUser, loggedIn } = useAuth();

  function loginSubmit(event: any) {
    event.preventDefault();
    console.log('test: ' + loggedIn)
    const userData = loginUser(mail, password);
    if (userData) {
      signIn(userData.uid);
      console.log('test: ' + loggedIn)
      console.log("Login Success");
    }
  }

  function logoutSubmit(event: any) {
    console.log('logout')
  }

  async function test() {
    createGroceryList("LIDL");
    console.log("test");
  }

  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Login</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="ion-padding">
      <IonInput 
        placeholder="E-Mail" 
        type="text" 
        onIonChange={(e: any) => setMail(e.target.value)}
      />
      <IonInput 
        placeholder="Password" 
        type="password" 
        onIonChange={(e: any) => setPassword(e.target.value)}
      />
      <IonButton onClick={loginSubmit}>Login</IonButton>
      <IonButton onClick={logoutSubmit}>Logout</IonButton>
      <IonButton onClick={test}>aaa</IonButton>
      
    </IonContent>
  </IonPage>
  );
};

export default Login;