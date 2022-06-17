import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
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
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';
import { addOutline, checkmark, saveOutline } from 'ionicons/icons';
import { Task } from '../models/Task';
import { Item } from '../models/Item';
import Label from '../components/Label';
import Header from '../components/Header';


const AddEntryPage: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();
  const [date, setDate] = useState<string | null | undefined>('');
  const [title, setTitle] = useState<string | null | undefined>('');
  const [task, setTask] = useState<Task>(Task.CERTIFICATE);
  const [description, setDescription] = useState<string | null | undefined>('');
  const [showToast, setShowToast] = useState(false);
  const [items, setItems] = useState<Item[]>([
    { title: 'Milch', certificate: "Bio", origin: "Bayern" },
    { title: 'Ei', certificate: "Bio", origin: "Bayern" },
  ]);
  const [currentItem, setCurrentItem] = useState<Item>({ title: '', certificate: '', origin: '' });

  const [showModal, setShowModal] = useState(false);


  //collection 2,4,6 
  //doc 1,3,5
  const handleItemSave = async () => {
    if (!Object.values(currentItem).every(x => (x === null || x === ''))) {
      setItems(prevItems => [...prevItems, currentItem])
      setShowModal(false);
      setCurrentItem({ title: '', certificate: '', origin: '' });
    } else {
      setShowToast(true);
    }
  }

  const handleSave = async () => {
    if (date && title && task) {
      const entriesRef = collection(db, 'users', userId ? userId : '0', 'purchases');
      const entryData = {
        date,
        title,
        description,
        reviewed: false,
        peerReviewed: false,
        items: items.map(item => ({ title: item.title, certificate: item.certificate, origin: item.origin })),
        created_at: serverTimestamp(),
      };
      //all good, save doc to db
      const entryRef = await setDoc(doc(entriesRef), entryData);
      console.log('saved:', entryRef);
      history.goBack();
      //history.replace('user/tab1')
    } else {
      setShowToast(true);
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
            <IonInput value={title} onIonChange={(event) => setTitle(event.detail.value)} placeholder="Einkaufsort" />
          </IonItem>
          <IonItem id="open-modal">
            <IonLabel position="stacked">Eingekauft am</IonLabel>
            <IonInput id="datetimeValue" value={date ? format(parseISO(date), 'd MMM, yyyy') : date} ></IonInput>
          </IonItem>
          <IonItem id="open-modal">
            <IonLabel position="stacked" >Wöchentliches Thema</IonLabel>
            <IonSelect value={task} onIonChange={(event) => setTask(event.detail.value)}>
              <IonSelectOption value={Task.CERTIFICATE}>Zertifikate</IonSelectOption>
              <IonSelectOption value={Task.SEASONALITY}>Saisonalität</IonSelectOption>
              <IonSelectOption value={Task.REGIONALITY}>Regionalität</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Kommentar</IonLabel>
            <IonTextarea placeholder="Informationen zur Auswahl der Artikel oder zusätzliche Hinweise" value={description} onIonChange={(event) => setDescription(event.detail.value)} />
          </IonItem>
        </IonList>
        <IonList className='ion-margin-top ion-margin-bottom'>
          <div className='flex flex-row content-between items-center p-5'>
            <IonListHeader className='p-0'>Artikel eintragen</IonListHeader>
            <IonButton fill="outline" onClick={() => setShowModal(!showModal)}>
              <IonIcon slot="start" icon={addOutline} />
              Hinzufügen
            </IonButton>
          </div>
          {items.map((item: Item, index: number) => {
            return (
              <IonCard key={index}>
                <IonCardHeader>
                  <IonCardTitle className="text-base" >{item.title}</IonCardTitle>
                  <IonCardSubtitle>Subtitle</IonCardSubtitle>
                </IonCardHeader>
                <IonItem>
                  <Label text="bewertet" link={'#'} >
                    <IonIcon slot="start" icon={checkmark} />
                  </Label>
                </IonItem>
              </IonCard>
            );
          })}
        </IonList>
        <IonButton expand="block" onClick={handleSave}>
          <IonIcon slot="start" icon={saveOutline} />
          Einkauf speichern
        </IonButton>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
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
      {/* Item Modal */}
      <IonModal isOpen={showModal}>
        <Header title="Neuer Artikel" slot={<IonButton onClick={() => setShowModal(false)}>Abbrechen</IonButton>} />
        <IonContent>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Name</IonLabel>
              <IonInput
                value={currentItem.title}
                onIonChange={(e) => { setCurrentItem({ ...currentItem, title: e.detail.value } as Item); }}
                placeholder="Einkaufsort" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Zertifikate</IonLabel>
              <IonInput
                value={currentItem.certificate}
                onIonChange={(e) => { setCurrentItem({ ...currentItem, certificate: e.detail.value } as Item); }}
                placeholder="Demeter, Bioland ..." />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Herkunft</IonLabel>
              <IonInput
                value={currentItem.origin}
                onIonChange={(e) => { setCurrentItem({ ...currentItem, origin: e.detail.value } as Item); }}
                placeholder="Bayern, Deutschland ..." />
            </IonItem>
          </IonList>
          <IonButton expand="block" onClick={handleItemSave}>
            <IonIcon slot="start" icon={saveOutline} />
            Hinzufügen
          </IonButton>
        </IonContent>
      </IonModal>
    </IonPage>
  );

};

export default AddEntryPage;
