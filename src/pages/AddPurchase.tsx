import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../service/authFirebase';
import { db } from '../service/firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';
import { addOutline, saveOutline } from 'ionicons/icons';


const AddEntryPage: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();
  const [date, setDate] = useState<string | null | undefined>('');
  const [title, setTitle] = useState<string | null | undefined>('');
  const [task, setTask] = useState<string>();
  const [description, setDescription] = useState<string | null | undefined>('');
  const [showToast1, setShowToast1] = useState(false);



  //collection 2,4,6 
  //doc 1,3,5
  const handleSave = async () => {
    if (date && title && task) {
      const entriesRef = collection(db, 'users', userId ? userId : '0', 'entries');
      const entryData = {
        date,
        title,
        description,
        reviewed: false,
        peerReviewed: false
      };
      //all good, save doc to db
      const entryRef = await setDoc(doc(entriesRef), entryData);
      console.log('saved:', entryRef);
      history.goBack();
    } else {
      setShowToast1(true);
      console.log('missing data');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Neuer Einkauf</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonListHeader>Einkauf Details</IonListHeader>
          <IonItem>
            <IonLabel position="stacked">Titel</IonLabel>
            <IonInput value={title} onIonChange={(event) => setTitle(event.detail.value)} placeholder="Einkaufsort"/>
          </IonItem>
          <IonItem id="open-modal">
            <IonLabel position="stacked">Eingekauft am</IonLabel>
            <IonInput id="datetimeValue" value={date ? format(parseISO(date), 'd MMM, yyyy') : date} ></IonInput>
          </IonItem>
          <IonItem id="open-modal">
            <IonLabel position="stacked" >Wöchentliches Thema</IonLabel>
            <IonSelect value={task} onIonChange={(event) => setTask(event.detail.value)}>
              <IonSelectOption value="certificate">Zertifikate</IonSelectOption>
              <IonSelectOption value="season">Saisonalität</IonSelectOption>
              <IonSelectOption value="region">Regionalität</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Kommentar</IonLabel>
            <IonTextarea placeholder="fInformationen zur Auswahl der Artikel oder zusätzliche Hinweise" value={description} onIonChange={(event) => setDescription(event.detail.value)} />
          </IonItem>
        </IonList>
        <IonList className='ion-margin-top ion-margin-bottom'>
          <div className='flex flex-row content-between items-center p-5'>
            <IonListHeader className='p-0'>Artikel eintragen</IonListHeader>
            <IonButton fill="outline">
              <IonIcon slot="start" icon={addOutline} />
              Hinzufügen
            </IonButton>
          </div>
        </IonList>

        <IonButton expand="block" onClick={handleSave}>
          <IonIcon slot="start" icon={saveOutline} />
          Speichern
        </IonButton>
        <IonToast
          isOpen={showToast1}
          onDidDismiss={() => setShowToast1(false)}
          message="Bitte alle Felder ausfüllen"
          duration={2000}
        />
      </IonContent>
      <IonPopover trigger="open-modal" showBackdrop={true}>
        <IonContent>
          <IonDatetime
            id="datetime"
            presentation="date"
            min="2022-06-13"
            value={date}
            onIonChange={(event) => setDate(event.detail.value)}
          ></IonDatetime>
        </IonContent>
      </IonPopover>
    </IonPage>
  );

};

export default AddEntryPage;
