import React, { useState } from "react";
import {
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonToast,
  IonPage,
  IonContent,
} from "@ionic/react";
import { loginUser, getCurrentUser } from "../service/auth";


const Login: React.FC = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  //TODO 
  // add Logic if empty 
  // add error toast message, if input is wrong
  // invalid mail
  //add Toast on success

  async function login() {
    try {
      const res = await loginUser(mail, password);
      if (res) {
        console.log("login success");
        //TODO
        // redirect to home
      } else {
        console.log("login failed");
      }
      console.log(res + " logged in");
      console.log(getCurrentUser())
    } catch (error) {
      console.log(error); 
    }
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
      <IonButton onClick={login}>Login</IonButton>
      
    </IonContent>
  </IonPage>
  );
};

export default Login;