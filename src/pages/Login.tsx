import React, { useState } from "react";
import {
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonPage,
  IonContent,
  IonText,
  IonLoading,
} from "@ionic/react";
import { useAuth } from "../service/authFirebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../service/firebaseConfig";
import { Redirect } from "react-router";



//Use one which works fine for you 


const Login: React.FC = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, error: false });


  //TODO 
  // add Logic if empty 
  // add error toast message, if input is wrong
  // invalid mail
  //add Toast on success

  const { loggedIn } = useAuth();

  //make async call to firebase and save userdata for session
  const handleLogin = async () => {
    try {
      setStatus({ loading: true, error: false });
      const data = (await signInWithEmailAndPassword(auth, mail, password)).user;
      console.log('handleLogin user:', data);
    } catch (error) {
      setStatus({ loading: false, error: true });
      console.log('error:', error);
    }
  };

  if (loggedIn) {
    return <Redirect to="/user/tab1" />;
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
        <IonButton onClick={handleLogin}>Login</IonButton>
        {status.error &&
          <IonText color="danger">Ungültige Eingabe</IonText>
        }
        <IonLoading isOpen={status.loading} />
      </IonContent>
    </IonPage>
  );
};

export default Login;