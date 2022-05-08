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
import { useAuth, getCurrentUser } from "../service/auth";
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
  const { signIn } = useAuth();
  async function loginSubmit() {
    //loginUser(mail, password);
    try {
      const data = (await signInWithEmailAndPassword(auth, mail, password))
        .user;
      const { uid } = data;
      console.log("uid", uid);
      const user = auth.currentUser;
      console.log(getCurrentUser());
      if (data && user) {
        console.log("data", data);
        console.log("data.uid", data.uid);
        console.log('loginClick: ' + getCurrentUser);
        //signIn(data.uid);

        console.log('authed user????' + user['uid']);
        if (user) {
          <Redirect to="/Tab1" />;
        } else {    
          console.log('not authed user');
        }
      } else {
        alert(`Please check your username and password`);
      }
      //localStorage.setItem("LoggedIn", JSON.stringify(uid));
      return data;
    } catch (e) {
      console.error("Error in Registering customer ", e);
    }
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
      <IonButton onClick={test}>aaa</IonButton>
      
    </IonContent>
  </IonPage>
  );
};

export default Login;