import { IonContent, IonPage, IonCard, IonCardHeader, IonCardSubtitle, IonIcon, IonFabButton, IonFab } from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';
import { Purchase as PurchaseModel } from '../models/Purchase';
import { useEffect, useState } from 'react';
/*Components*/
import Notification from '../components/NotificationItem';
import Header from '../components/Header';
import PurchaseHeader from '../components/PurchaseHeader';
/* Firestore */
import { db } from "../service/firebaseConfig";
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useAuth } from '../service/authFirebase';


const Tab1: React.FC = () => {
  const { userId } = useAuth();
  const [purchases, setPurchases] = useState<any>([]);
  const purchaseRef = collection(db, 'purchases');

  useEffect(() => {
    const getPurchases = async () => {
      const q = query(purchaseRef, where("owner", "==", userId), orderBy("date", "desc"));
      const data = await getDocs(q);
      setPurchases(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPurchases();
  }, []);

  return (
    <IonPage>
      <Header title='Einkäufe' showLogout={true} />
      <IonContent fullscreen>
        {/* Notifications */}
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
