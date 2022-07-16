import { IonContent, IonPage, IonCard, IonCardHeader, IonCardSubtitle, IonRefresher, IonRefresherContent, RefresherEventDetail } from '@ionic/react';
import Notification from '../components/NotificationItem';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { Purchase as PurchaseModel } from '../models/Purchase';
import PurchaseHeader from '../components/PurchaseHeader';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../service/firebaseConfig';
import { useAuth } from '../service/authFirebase';
import { chevronDownCircleOutline } from 'ionicons/icons';

const Tab2: React.FC = () => {
  const { userId } = useAuth();
  const [otherPurchases, setOtherPurchases] = useState<any[]>([]);
  const docRef = collection(db, 'purchases');
  const q = query(docRef, where("peerReviewer", "==", userId), orderBy("date", "desc"));
  const [refresh, setRefresh] = useState<boolean>(false);


  //make async call FB to get purchases, which need to be reviewed
  useEffect(() => {
    const getOtherPurchases = async () => {
      const data = await getDocs(q);
      setOtherPurchases(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getOtherPurchases();
  }, [refresh])

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    setRefresh(!refresh);

    setTimeout(() => {
      console.log('Async operation has ended');
      event.detail.complete();

    }, 1000);
  }
  return (
    <IonPage>
      <Header title="Feedback " showLogout={true} />
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* Notifications */}
        <IonCard>
          <IonCardHeader color="warning">
            <IonCardSubtitle>Notifications</IonCardSubtitle>
          </IonCardHeader>
          {otherPurchases.map((purchase: PurchaseModel, index: number) => {
            if (!purchase.peerReviewed) {
              return <Notification key={"notification-" + purchase.id} details={purchase.title} link={"/user/tab2/view/" + purchase.id} reviewType='peerReview' />
            } else return true;
          })}
        </IonCard>

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
