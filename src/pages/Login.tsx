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
import { createGroceryList, auth } from "../service/firebaseConfig";
import { useHistory } from "react-router-dom";


//Use one which works fine for you 


const Login: React.FC = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory()

  //TODO 
  // add Logic if empty 
  // add error toast message, if input is wrong
  // invalid mail
  //add Toast on success

  const { signIn, loginUser, logoutUser, loggedIn, loading } = useAuth();
  
  //make async call to firebase and save userdata for session
  async function loginSubmit(event: any) {
    event.preventDefault();
    //https://firebase.google.com/docs/reference/js/v8/firebase.User
    const userData = await loginUser(mail, password);
    console.log("userData: " +  userData)
    if (userData.error) {
      console.log("error: " + userData.error);
    } else {
      signIn(userData);
      // history.push('/tab1')
      console.log("loginSubmit success!");
    }
  }

  function logoutSubmit(event: any) {
    event.preventDefault();
    logoutUser();
    console.log("logoutSubmit success!");
  }
  // history.push('/login');

  function test() {
    const data = auth.currentUser
    console.log("data: " + data?.uid);
    console.log("loggedIn: " + loggedIn);
    console.log('loading: ' + loading);
    console.log('currentUser: ' + auth?.currentUser);
    // createGroceryList("LIDL");
    // console.log("test");
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
      <IonButton onClick={test}>test vars</IonButton>
      
    </IonContent>
  </IonPage>
  );
};

export default Login;