import {
  IonAlert,
  IonButton,
  IonContent,
  IonDatetime,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonNote,
  IonPage,
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToast,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../service/authFirebase';
import { db } from '../service/firebaseConfig';
import { collection, doc, setDoc, serverTimestamp, where, query, getDoc, orderBy, getDocs } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';
import { addOutline, saveOutline } from 'ionicons/icons';
import { Task } from '../models/Task';
import { Item } from '../models/Item';
import Header from '../components/Header';
import PurchaseItem from '../components/PurchaseItem';
import { User } from '../models/User';
import { ReviewType } from '../models/ReviewType';


const AddEntryPage: React.FC = () => {
  const { userId, email } = useAuth();
  const history = useHistory();

  const [date, setDate] = useState<string | undefined | null>('');
  const [title, setTitle] = useState<string>('');
  const [task, setTask] = useState<Task>(Task.CERTIFICATE);
  const [description, setDescription] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item>({ title: '', certificate: '', origin: '' });
  const [items, setItems] = useState<Item[]>([
    { title: 'Milch', certificate: "Bio", origin: "Bayern" },
    { title: 'Ei', certificate: "Bio", origin: "Bayern" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [userData, setUserData] = useState<User>();
  const [peerReviewer, setPeerReviewer] = useState<any[]>();

  useEffect(() => {
    const userRef = doc(db, "users", userId ? userId : '0');
    const getUserProfile = async () => {
      const userDoc = await getDoc(userRef);
      setUserData(userDoc.data() as User);
    }
    getUserProfile();
  }, [userId])

  //Query to find peerReviewer in same week and min peerReviewsWritten
  useEffect(() => {
    //Purchase Data
    //if currentUser is in group peerReviews 
    //look for other peerReview User
    // with min peerreviewsWritten 
    //has to be in the same week in same group of task this week
    //check if week array matches
    //const q = query(purchaseRef, where("owner", "==", userId), orderBy("date", "desc"));
    if (userData && userData?.reviewType === ReviewType.PeerReview) {
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('reviewType', '==', ReviewType.PeerReview), where('week', '==', userData.week), orderBy('peerReviewsWritten', 'asc'));
      const getPeerReviewer = async () => {
        const userDocs = await getDocs(q);
        setPeerReviewer(userDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )
      }
      console.log("peerReviewer: " + peerReviewer, peerReviewer);
      console.count("userData: " + userData.email);
      getPeerReviewer()
      //remove self from peerReviewer
      const indexOfSelf = peerReviewer?.findIndex(object => {
        return object.id === userId; //-1 if undefined
      });
      if (indexOfSelf && peerReviewer) {
        peerReviewer.splice(indexOfSelf, 1)
      }

    }
  }, [email, userData, items]) //items keine edle Lösung, weil es bei jedem hinzufügen ne neue anfrage schickt.

  //collection 2,4,6 
  //doc 1,3,5
  const handleItemSave = async () => {
    if (currentItem.certificate && currentItem.title && currentItem.origin) {
      setItems(prevItems => [...prevItems, currentItem])
      setShowModal(false);
      setCurrentItem({ title: '', certificate: '', origin: '' });
    } else {
      setShowToast(true);
    }
  }
  const handleItemDelete = async (itemToDelete: Item) => {
    setItems(items.filter(item => item.title !== itemToDelete.title));
  }

  const handleSave = async () => {
    if (date && title && task) {
      const entriesRef = collection(db, 'purchases');

      const peerId = "SCHuGu627XMMOoCl7KWVk49MZrY2" //tamia@test.de
      //erwartet test, sarah

      const entryData = {
        date,
        title,
        description,
        task,
        reviewed: false,
        peerReviewed: false,
        items: items.map(item => ({ title: item.title, certificate: item.certificate, origin: item.origin })),
        createdAt: serverTimestamp(),
        owner: userId,
        peerReviewer: peerReviewer ? peerReviewer[0].id : peerId, //check if this purchase is peerReviewed
      };

      const docRef = doc(entriesRef);

      const setPurchaseToFB = async () => {
        await setDoc(docRef, entryData) //set purchase to db
      }
      setPurchaseToFB().then(() => {
        const location = {
          pathname: '/user/tab1/add/review',
          state: { purchaseId: docRef.id, reviewType: ReviewType.SelfReview } //send purchaseId to next view
        }
        history.replace(location)
      }, error => {
        console.log("oh noes, an validation error?? " + error);
        //console.log(errors.all()); // prints the errors array just like you're used to in v2
      })
    } else {
      setShowToast(true);
      console.log('missing data at handleSave method');
    }
  };

  return (
    <IonPage>
      <Header title='Neuer Einkauf' showBackBtn={true} />
      <IonContent fullscreen>
        <IonList>
          <IonListHeader className='uppercase'>Einkauf Details</IonListHeader>
          <IonItem>
            <IonLabel position="stacked">Titel</IonLabel>
            <IonInput value={title} onIonChange={(event) => setTitle(event.detail.value as string)} placeholder="Einkaufsort" />
          </IonItem>
          <IonItem id="open-modal">
            <IonLabel position="stacked">Eingekauft am</IonLabel>
            <IonInput id="datetimeValue" value={date ? format(parseISO(date), 'd MMM, yyyy') : date} ></IonInput>
          </IonItem>
          <IonItem id="open-modal">
            <IonLabel className='text-lg' position="stacked" >Wöchentliches Thema</IonLabel>
            <IonSelect value={task} onIonChange={(event) => setTask(event.detail.value)}>
              <IonSelectOption value={Task.CERTIFICATE}>Zertifikate</IonSelectOption>
              <IonSelectOption value={Task.SEASONALITY}>Saisonalität</IonSelectOption>
              <IonSelectOption value={Task.REGIONALITY}>Regionalität</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Kommentar</IonLabel>
            <IonTextarea placeholder="Informationen zur Auswahl der Artikel oder andere Hinweise" value={description} onIonChange={(event) => setDescription(event.detail.value as string)} />
          </IonItem>
        </IonList>
        <IonList className='ion-margin-top ion-margin-bottom'>
          <div className='flex flex-row content-between items-center p-5'>
            <IonListHeader className='p-0 uppercase'>Artikel eintragen</IonListHeader>
            <IonButton fill="outline" onClick={() => setShowModal(!showModal)}>
              <IonIcon slot="icon-only" icon={addOutline} />
            </IonButton>
          </div>
          <IonNote className='px-5 mb-5'>Wählen sie passend zum Thema 3-5 Produkte aus.</IonNote><br />
          {items.map((item: Item, index: number) => {
            return (
              <PurchaseItem key={index} item={item} onDelete={() => handleItemDelete(item)} editable={true} />
            );
          })}
        </IonList>
        <IonButton className='uppercase' onClick={() => setShowAlert(true)} expand="block">
          <IonIcon slot="start" icon={saveOutline} /> Einkauf speichern
        </IonButton>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Bitte alle Felder ausfüllen"
          duration={2000}
        />
      </IonContent>
      {/* Alert before save */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass='my-custom-class'
        header={'Wirklich fertig?'}
        message={'Der Einkauf kann nach dem Speichern nicht mehr geändert werden.'}
        buttons={[
          'Abbrechen',
          {
            text: 'Speichern',
            id: 'confirm-button',
            handler: () => {
              handleSave();
            }
          }
        ]}
      />
      {/* Calender Popover */}
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

      {/* Purchase Item Modal */}
      <IonModal isOpen={showModal}>
        <Header title="Neuer Artikel" slotRight={<IonButton onClick={() => setShowModal(false)}>Abbrechen</IonButton>} />
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
          <IonButton className='uppercase' expand="block" onClick={handleItemSave}>
            <IonIcon slot="start" icon={addOutline} /> Hinzufügen
          </IonButton>
        </IonContent>
      </IonModal>
    </IonPage>
  );

};

export default AddEntryPage;
