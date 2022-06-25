import { IonContent, IonPage, IonCard, IonCardHeader, IonCardSubtitle, IonIcon, IonFabButton, IonFab } from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';
import Notification from '../components/NotificationItem';
import PurchaseOverview from "../components/PurchaseOverview"
import Header from '../components/Header';
/* Firestore */
import { db } from "../service/firebaseConfig";
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../service/authFirebase';
import { useEffect, useState } from 'react';
import { Purchase as PurchaseModel } from '../models/Purchase';
import PurchaseHeader from '../components/PurchaseHeader';


const Tab1: React.FC = () => {
  const { userId } = useAuth();
  const [purchases, setPurchases] = useState<any>([]);
  const entiresDocumentRef = collection(db, "users", userId ? userId : '0', 'purchases');

  useEffect(() => {
    const getPurchases = async () => {
      const data = await getDocs(entiresDocumentRef);
      setPurchases(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPurchases();
  }, []);
  return (
    <IonPage>
      <Header title='Einkäufe' showLogout={true}/>
      <IonContent fullscreen>
        {/* Notifications */}
        <IonCard>
          <IonCardHeader color="primary">
            <IonCardSubtitle>Notifications</IonCardSubtitle>
          </IonCardHeader>
          <Notification details='Lidl' link='#' reviewType='peerReview' />
        </IonCard>
        {console.log('purchases:', purchases)}
        {/* Example Cart */}
        {purchases.map((purchase: PurchaseModel) => {
          return (
            <PurchaseHeader
              key={purchase.id}
              title={purchase.title}
              date={purchase.date}
              task={purchase.task}
              link={"/user/tab1/view/" + purchase.id}
              overview={{
                reviewed: purchase.reviewed,
                peerReviewed: purchase.peerReviewed,
              }}
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
