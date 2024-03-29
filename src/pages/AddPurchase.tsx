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
import { getTaskOfTheWeekQuery } from '../service/userData';
import { collection, doc, setDoc, serverTimestamp, getDoc, getDocs } from 'firebase/firestore';
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
  const [showToastItems, setShowToastItems] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item>({ title: '', certificate: '', origin: '' });
  const [items, setItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [userData, setUserData] = useState<User>();
  const [peerReviewers, setPeerReviewers] = useState<any[]>();
  const [peerReviewerId, setPeerReviewerId] = useState<string>();

  useEffect(() => {
    const userRef = doc(db, "users", userId ? userId : '0');
    const getUserProfile = async () => {
      const userDoc = await getDoc(userRef);
      setUserData(userDoc.data() as User);
    }
    getUserProfile();
  }, [userId])

  //Query to find fitting peerReviewers
  useEffect(() => {
    if (userData && userData?.reviewType === ReviewType.PeerReview) {
      const currentTaskOfTheWeek = getTaskOfTheWeekQuery(userData);
      if (!currentTaskOfTheWeek) {
        console.log('currentTaskOfTheWeek: ', 'userData undefined oder außerhalb des Studienzeitraums');
      } else {
        //Individual query to find peerReviewers in same week, in peerReview Group and min peerReviewsWritten
        const getPeerReviewers = async () => {
          const userDocs = await getDocs(currentTaskOfTheWeek);
          setPeerReviewers(userDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          )
        }
        getPeerReviewers()
        //CLEAN remove self from peerReviewers
        const indexOfSelf = peerReviewers?.findIndex(object => {
          return object.id === userId; //-1 if undefined
        });
        if (indexOfSelf !== -1 && indexOfSelf !== undefined) {
          setPeerReviewers(peerReviewers?.splice(indexOfSelf, 1))
        }
        //set the first peerReviewer from the List or use Fallback
        if (peerReviewers?.length === 0) {
          const peerId = "SCHuGu627XMMOoCl7KWVk49MZrY2" //tamia@test.de
          setPeerReviewerId(peerId);
          console.log('Fallback: ', peerReviewers.length);
        } else {
          console.log('out of list: ', peerReviewers?.[0].id ?? 'undefined');
          setPeerReviewerId(peerReviewers?.[0]?.id);
        }
        console.log('peerReviewers: ', peerReviewers);
        console.log('peerReviewerId: ', peerReviewerId);
      }
      // peerReviewers?.filter(object => { return object.email !== email; })
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
    if (date && title && task && items.length > 2) {
      console.log('save');
      const entriesRef = collection(db, 'purchases');
      //vielleicht wenn man keine peer reviewer id hat, einfach tamia@test.de nehmen als reviewer?
      //const peerId = "SCHuGu627XMMOoCl7KWVk49MZrY2" //tamia@test.de
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
        peerReviewer: userData?.reviewType === ReviewType.PeerReview ? peerReviewerId : '' //check if this purchase is peerReviewed //TODO do not set if Signle Review
      };

      const docRef = doc(entriesRef);

      const setPurchaseToFB = async () => {
        await setDoc(docRef, entryData) //set purchase to db
      }
      setPurchaseToFB().then(() => {
        const location = {
          pathname: '/user/tab1/add/review',
          state: { purchaseId: docRef.id, reviewType: ReviewType.SelfReview} //send purchaseId to next view
        }
        history.replace(location)
      }, error => {
        console.log("oh no, an validation error?? " + error);
      })
    } else if (items.length <= 2) {
      setShowToastItems(true);
    } else {
      console.log('missing data at handleSave method');
      console.log('date: ', date);
      console.log('title: ', title);
      console.log('task: ', task);
      console.log('items: ', items);
      console.log('peerReviewerId: ', peerReviewerId);

      setShowToast(true);
    }
  };

  //set Task of the week as value
  useEffect(() => {
    const currentTask: Task | boolean = getTaskOfTheWeek(userData)
    if (currentTask === Task.CERTIFICATE) {
      setTask(Task.CERTIFICATE);
    } else if (currentTask === Task.REGIONALITY) {
      setTask(Task.REGIONALITY);
    } else if (currentTask === Task.SEASONALITY) {
      setTask(Task.SEASONALITY);
    }
  }, [userData])
  return (
    <IonPage>
      <Header title='Neuer Einkauf' showBackBtn={true} />
      <IonContent fullscreen>
        <IonList>
          <IonListHeader className='uppercase'>Einkaufsdetails</IonListHeader>
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
              <IonSelectOption value={Task.CERTIFICATE}>{Task.CERTIFICATE}</IonSelectOption>
              <IonSelectOption value={Task.SEASONALITY}>{Task.SEASONALITY}</IonSelectOption>
              <IonSelectOption value={Task.REGIONALITY}>{Task.REGIONALITY}</IonSelectOption>
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
          <IonNote className='px-5 mb-5'>Wähle 3-5 Produkte passend zum Thema. </IonNote>
          <br />
          <br />
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
        <IonToast
          isOpen={showToastItems}
          onDidDismiss={() => setShowToastItems(false)}
          message={"Nicht genügend Produkte (min. 3), aktuell " + items.length}
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
            min="2022-07-25"
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
                placeholder="Produktname" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Zertifizierung</IonLabel>
              <IonInput
                value={currentItem.certificate}
                onIonChange={(e) => { setCurrentItem({ ...currentItem, certificate: e.detail.value } as Item); }}
                placeholder="Demeter, Bioland... oder - für keine" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Herkunft</IonLabel>
              <IonInput
                value={currentItem.origin}
                onIonChange={(e) => { setCurrentItem({ ...currentItem, origin: e.detail.value } as Item); }}
                placeholder="Bayern, Deutschland..." />
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

export const getTaskOfTheWeek = (userData: User | undefined) => {
  var startDate = userData?.startDate.toDate()
  const manuell = new Date(2022, 6, 25); //month start with 0
  startDate = startDate ?? manuell
  const currentDate = new Date();
  const secondWeek = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 7);
  const thirdWeek = new Date(secondWeek.getFullYear(), secondWeek.getMonth(), secondWeek.getDate() + 7);
  if (userData?.task !== undefined) {
    if (currentDate < secondWeek) {
      return userData?.task?.week1;
    } else if (secondWeek <= currentDate && currentDate < thirdWeek) {
      return userData?.task?.week2
    } else if (thirdWeek <= currentDate) {
      return userData?.task?.week3
    } else {
      return false
    }
  } else {
    return false
  }
}
