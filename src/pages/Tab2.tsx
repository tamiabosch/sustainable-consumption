import { IonContent, IonPage, IonCard, IonCardHeader, IonCardSubtitle, IonRefresher, IonRefresherContent, RefresherEventDetail, useIonViewWillEnter } from '@ionic/react';
import Notification from '../components/NotificationItem';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { Purchase as PurchaseModel } from '../models/Purchase';
import PurchaseHeader from '../components/PurchaseHeader';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../service/firebaseConfig';
import { useAuth } from '../service/authFirebase';

const Tab2: React.FC = () => {
  const { userId } = useAuth();
  const [otherPurchases, setOtherPurchases] = useState<any[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any>([]);

  const docRef = collection(db, 'purchases');
  const q = query(docRef, where("peerReviewer", "==", userId), orderBy("date", "desc"));

  //make async call FB to get purchases, which need to be reviewed
  useIonViewWillEnter(() => {
    const getOtherPurchases = async () => {
      const data = await getDocs(q);
      setOtherPurchases(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getOtherPurchases();
  }, [refresh])

  useEffect(() => {
    if (otherPurchases) {
      var openForReviewPurchase = otherPurchases.filter(function (el: { peerReviewed: boolean; }) {
        return el.peerReviewed === false;
      });
      console.log('new Notifications', openForReviewPurchase);
      setNotifications(openForReviewPurchase);
    }
  }, [otherPurchases]);

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    setRefresh(!refresh);

    setTimeout(() => {
      console.log('Async operation has ended');
      event.detail.complete();
    }, 1000);
  }
  return (
    <IonPage>
      <Header title="Feedback für andere Einkäufe" />
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* Notifications */}
        {notifications?.length > 0 &&
          <IonCard>
            <IonCardHeader color="warning">
              <IonCardSubtitle>Notifications</IonCardSubtitle>
            </IonCardHeader>
            {notifications.map((notification: PurchaseModel) => {
              return <Notification key={"notification-" + notification.id} details={notification.title} date={notification.date} link={"/user/tab2/view/" + notification.id} reviewType='peerReview' />
            })}
          </IonCard>
        }

        {/* Feedback Purchases */}
        {otherPurchases.map((purchase: PurchaseModel) => {
          return (
            <PurchaseHeader
              id={purchase.id}
              key={purchase.id}
              title={purchase.title}
              date={purchase.date}
              task={purchase.task}
              link={"/user/tab2/view/" + purchase.id}
              overview={true}
              reviewed={purchase.reviewed}
              peerReviewed={purchase.peerReviewed}
              owner={purchase.owner}
              peerReviewer={purchase.peerReviewer}

            />
          );
        })}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
