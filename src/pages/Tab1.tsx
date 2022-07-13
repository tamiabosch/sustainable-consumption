import { IonContent, IonPage, IonCard, IonCardHeader, IonCardSubtitle, IonIcon, IonFabButton, IonFab, IonToolbar, IonTitle } from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';
import { Purchase as PurchaseModel } from '../models/Purchase';
import { useEffect, useState } from 'react';
/*Components*/
import Notification from '../components/NotificationItem';
import Header from '../components/Header';
import PurchaseHeader from '../components/PurchaseHeader';
/* Firestore */
import { db } from "../service/firebaseConfig";
import { collection, doc, getDoc, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { useAuth } from '../service/authFirebase';
import { User } from '../models/User';


const Tab1: React.FC = () => {
  const { userId } = useAuth();
  const [purchases, setPurchases] = useState<any>([]);
  const purchaseRef = collection(db, 'purchases');
  const [currentTask, setCurrentTask] = useState<string>();

  useEffect(() => {
    const getPurchases = async () => {
      const q = query(purchaseRef, where("owner", "==", userId), orderBy("date", "desc"));
      const data = await getDocs(q);
      setPurchases(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPurchases();
  }, []);

  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    const userRef = doc(db, "users", userId ? userId : '0');
    const getUserProfile = async () => {
      const userDoc = await getDoc(userRef);
      setUserData(userDoc.data() as User);
    }
    getUserProfile();
  }, [userId])

  useEffect(() => {
    setCurrentTask(getTaskOfTheWeek(userData))
  }, [userData]);

  return (
    <IonPage>
      <Header title='Meine Einkäufe' showLogout={true} />
      <IonContent fullscreen>
        {/* Notifications */}
        <IonToolbar color='primary' className='mb-4'>
          <IonTitle className='text-base p-1'>{currentTask}</IonTitle>
        </IonToolbar>
        <IonCard>
          <IonCardHeader color="warning">
            <IonCardSubtitle>Notifications</IonCardSubtitle>
          </IonCardHeader>
          <Notification details='Lidl' link='#' reviewType='peerReview' />
        </IonCard>
        {console.log('purchases:', purchases)}
        {/* Example Cart */}
        {purchases.map((purchase: PurchaseModel) => {
          return (
            <PurchaseHeader
              id={purchase.id}
              key={purchase.id}
              title={purchase.title}
              date={purchase.date}
              task={purchase.task}
              link={"/user/tab1/view/" + purchase.id}
              overview={true}
              reviewed={purchase.reviewed}
              peerReviewed={purchase.peerReviewed}
              owner={purchase.owner}
              peerReviewer={purchase.peerReviewer}
            />
          );
        })}
        {/*-- fab placed to the bottom end --*/}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/user/tab1/add/purchase">
            <IonIcon icon={addCircleOutline} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;

export const getTaskOfTheWeek = (userData: User | undefined) => {
  var startDate = userData?.startDate.toDate()
  const manuell = new Date(2022, 6, 27);
  startDate = startDate ? startDate : manuell

  const currentDate = new Date();
  const secondWeek = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 7);
  const thirdWeek = new Date(secondWeek.getFullYear(), secondWeek.getMonth(), secondWeek.getDate() + 7);
  const end = new Date(thirdWeek.getFullYear(), thirdWeek.getMonth(), thirdWeek.getDate() + 7);
  console.log('start: ' + startDate);
  console.log('manuell: ' + manuell);
  if (currentDate < startDate) {
    return "Studie startet am " + startDate.toLocaleDateString();
  } else if (startDate < currentDate && currentDate < secondWeek) {
    return 'Thema der Woche: ' + userData?.week[0] || "Thema der Woche unter Profil einsehen";
  } else if (secondWeek < currentDate && currentDate < thirdWeek) {
    return 'Thema der Woche: ' + userData?.week[1] || "Thema der Woche unter Profil einsehen";
  } else if (thirdWeek < currentDate && currentDate < end) {
    return 'Thema der Woche: ' + userData?.week[2] || "Thema der Woche unter Profil einsehen";
  } else if (currentDate > end) {
    return "Studie beendet" + end.getDate() + "." + end.getMonth() + "." + end.getFullYear();
  } else {
    return "Thema der Woche unter Profil einsehen"
  }
}
