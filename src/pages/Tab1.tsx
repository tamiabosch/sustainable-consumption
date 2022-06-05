import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonFabButton, IonFab } from '@ionic/react';
import { addCircleOutline, enterOutline } from 'ionicons/icons';
import Notification from '../components/NotificationItem';
import Purchase from '../components/Purchase';
import Header from '../components/Header';
/* Firestore */
import { db, auth } from "../service/firebaseConfig";
import { collection, doc, getDocs } from 'firebase/firestore';
import { useAuth } from '../service/authFirebase';
import { useEffect, useState } from 'react';
import { Purchase as PurchaseModel } from '../models/Purchase';


const Tab1: React.FC = () => {
  const { userId } = useAuth();
  const [purchases, setPurchases] = useState<any>([]);
  const entiresDocumentRef = collection(db, "users", "6sKG5B9fzRdJfJ3SmvPtiX6h4A83", 'entries');

  useEffect(() => {
    const getPurchases = async () => {
      const data = await getDocs(entiresDocumentRef);
      console.log('data:', data.docs);
      setPurchases(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPurchases();
  }, []);
  return (
    <IonPage>
      <Header title='Einkäufe' />
      <IonContent fullscreen>
        {/* Notifications */}      
        <IonCard>
          <IonCardHeader color="warning">
            <IonCardSubtitle>Notifications</IonCardSubtitle>
          </IonCardHeader>
          <Notification details='Lidl' link='#' reviewType='peerReview' />
        </IonCard>

         {/* Example Cart */}
         {purchases.map((purchase: PurchaseModel) => {
        return (
          <Purchase 
            title={purchase.title} 
            date={purchase.date} 
            link={"/user/tab1/" + purchase.id} 
            reviewed={purchase.reviewed} 
            peerReviewed={purchase.peerReviewed} />
        );
      })}
        {/*-- fab placed to the bottom end --*/}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/user/tab1/add">
            <IonIcon icon={addCircleOutline} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
