import { IonContent, IonPage, IonCard, IonCardHeader, IonCardSubtitle, IonIcon, IonFabButton, IonFab, IonToolbar, IonTitle, IonRefresher, IonRefresherContent, RefresherEventDetail } from '@ionic/react';
import { addCircleOutline, chevronDownCircleOutline, contractOutline, notifications, refresh } from 'ionicons/icons';
import { Purchase as PurchaseModel } from '../models/Purchase';
import { useEffect, useState } from 'react';
/*Components*/
import Notification from '../components/NotificationItem';
import Header from '../components/Header';
import PurchaseHeader from '../components/PurchaseHeader';
/* Firestore */
import { db } from "../service/firebaseConfig";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useAuth } from '../service/authFirebase';
import { User } from '../models/User';


const Tab1: React.FC = () => {
  const { userId } = useAuth();
  const [purchases, setPurchases] = useState<any>([]);
  const [notifications, setNotifications] = useState<any>([]);
  const purchaseRef = collection(db, 'purchases');
  const [currentTask, setCurrentTask] = useState<string>();
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    const getPurchases = async () => {
      const q = query(purchaseRef, where("owner", "==", userId), orderBy("date", "desc"));
      const data = await getDocs(q);
      setPurchases(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPurchases()
  }, [refresh]);

  //get all Purchases which are not complety reviewed
  useEffect(() => {
    if (purchases) {
      var openForReviewPurchase = purchases.filter(function (el: { reviewed: boolean; }) {
        return el.reviewed === false;
      });
      console.log('new', openForReviewPurchase);
      setNotifications(openForReviewPurchase);
    }
  }, [purchases]);

  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    const userRef = doc(db, "users", userId ? userId : '0');
    const getUserProfile = async () => {
      const userDoc = await getDoc(userRef);
      setUserData(userDoc.data() as User);
    }
    getUserProfile();
  }, [userId, refresh])

  useEffect(() => {
    setCurrentTask(getTaskOfTheWeek(userData))
  }, [userData]);

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    setRefresh(!refresh);

    setTimeout(() => {
      console.log('Async operation has ended');
      event.detail.complete();

    }, 1000);
  }

  return (
    <IonPage>
      <Header title='Meine Einkäufe' showLogout={true} />
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonToolbar color='primary' className='mb-4'>
          <IonTitle className='text-base py-1 px-4'>{currentTask}</IonTitle>
        </IonToolbar>
        {/* Notifications */}
        {notifications.length > 0 &&
          <IonCard>
            <IonCardHeader color="warning">
              <IonCardSubtitle>Notifications</IonCardSubtitle>
            </IonCardHeader>
            {notifications.map((notification: PurchaseModel) => {
              return <Notification key={"notification-" + notification.id} details={notification.title} date={notification.date} link={"/user/tab1/view/" + notification.id} reviewType='review' />
            })}
          </IonCard>
        }

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
    return 'Thema der Woche: ' + userData?.task?.week1 || "Thema der Woche unter Profil einsehen";
  } else if (secondWeek < currentDate && currentDate < thirdWeek) {
    return 'Thema der Woche: ' + userData?.task?.week2 || "Thema der Woche unter Profil einsehen";
  } else if (thirdWeek < currentDate && currentDate < end) {
    return 'Thema der Woche: ' + userData?.task?.week3 || "Thema der Woche unter Profil einsehen";
  } else if (currentDate > end) {
    return "Studie beendet" + end.getDate() + "." + end.getMonth() + "." + end.getFullYear();
  } else {
    return "Thema der Woche unter Profil einsehen"
  }
}
