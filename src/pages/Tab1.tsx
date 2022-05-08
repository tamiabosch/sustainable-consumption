import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonFabButton, IonFab } from '@ionic/react';
import { addCircleOutline, enterOutline } from 'ionicons/icons';
import Notification from '../components/NotificationItem';
import Purchase from '../components/Purchase';
import Header from '../components/Header';


const Tab1: React.FC = () => {
  return (
    <IonPage>
      <Header title='Einkäufe' />
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>

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
          <IonFabButton>
            <IonIcon icon={addCircleOutline} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
