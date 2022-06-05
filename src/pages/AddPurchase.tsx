import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonDatetime,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTextarea,
    IonTitle,
    IonToolbar,
    isPlatform,
  } from '@ionic/react';
import { CameraResultType, CameraSource, Camera } from '@capacitor/camera';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../service/authFirebase';
import { db, auth } from '../service/firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
  
  const AddEntryPage: React.FC = () => {
    const { userId } = useAuth();
    const history = useHistory();
    const [date, setDate] = useState<string | null | undefined>('') ;
    const [title, setTitle] = useState<string | null | undefined>('');
    const [pictureUrl, setPictureUrl] = useState('/assets/placeholder.png');
    const [description, setDescription] = useState<string | null | undefined>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    
        //collection 2,4,6 
        //doc 1,3,5
    const handleSave = async () => {
      const entriesRef = collection(db,'users', userId ? userId : '0', 'entries');
      const entryData = { date, title, pictureUrl, description };
      // if (!pictureUrl.startsWith('/assets')) {
      //   entryData.pictureUrl = await savePicture(pictureUrl, userId ? userId : '0');
      // }
      //all good, save doc to db
      const entryRef = await setDoc(doc(entriesRef), entryData);
      console.log('saved:', entryRef);
      history.goBack();
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>Neuen Einlauf anlegen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
        <IonItem>
              <IonLabel position="stacked">Titel</IonLabel>
              <IonInput value={title}
                onIonChange={(event) => setTitle(event.detail.value)}
              />
            </IonItem>
          <IonList>
          <IonItem>
            <IonLabel position="stacked">Eingekauft am</IonLabel>
            <IonDatetime value={date}
              onIonChange={(event) => setDate(event.detail.value)}
            />
          </IonItem>
            <IonItem>
              <IonLabel position="stacked">Description</IonLabel>
              <IonTextarea value={description}
                onIonChange={(event) => setDescription(event.detail.value)}
              />
            </IonItem>
          </IonList>
          <IonButton expand="block" onClick={handleSave}>Save</IonButton>
        </IonContent>
      </IonPage>
    );
  };
  
  export default AddEntryPage;
  