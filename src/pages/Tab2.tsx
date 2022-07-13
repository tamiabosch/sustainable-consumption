import { IonContent, IonPage, IonCard, IonCardHeader, IonCardSubtitle } from '@ionic/react';
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
  const docRef = collection(db, 'purchases');
  const q = query(docRef, where("peerReviewer", "==", userId), orderBy("date", "desc"));

  //make async call FB to get purchases, which need to be reviewed
  useEffect(() => {
    const getOtherPurchases = async () => {
      const data = await getDocs(q);
      setOtherPurchases(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getOtherPurchases();
  }, [])
  return (
    <IonPage>
      <Header title="Feedback" showLogout={true} />
      <IonContent fullscreen>

        {/* Notifications */}
        <IonCard>
          <IonCardHeader color="warning">
            <IonCardSubtitle>Notifications</IonCardSubtitle>
          </IonCardHeader>
          <Notification details="12.04" link='#' reviewType={'review'} />
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
