import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonFabButton, IonFab } from '@ionic/react';
import { addCircleOutline, enterOutline } from 'ionicons/icons';
import Notification from '../components/NotificationItem';
import Purchase from '../components/Purchase';
import Header from '../components/Header';
/* Firestore */
import { db } from "../service/firebaseConfig";
import { collection, doc, getDocs } from 'firebase/firestore';
import { useAuth } from '../service/authFirebase';
import { useEffect } from 'react';


const Tab1: React.FC = () => {
  const { userId } = useAuth();
  const usersCollectionRef = collection(db, "users");

  const userDocumentRef = doc(db, "users", userId ? userId : "6sKG5B9fzRdJfJ3SmvPtiX6h4A83");

  useEffect(() => {
    const getUser = async () => {
      // const userData = await getDocs(usersCollectionRef);
      console.log("userData: ", userDocumentRef);

    };

    getUser();
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
        <Purchase title="Kaffee" date="20.05.2020" link="#" reviewed={true} peerReviewed={true} />


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
