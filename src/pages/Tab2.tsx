import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonFabButton, IonFab } from '@ionic/react';
import { pin, checkmark, cart, addCircleOutline } from 'ionicons/icons';
import Notification from '../components/Notification';import './Tab2.css';

const Tab2: React.FC = () => {
  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
      <IonIcon icon={cart} slot="end" class="ion-margin-end" />
        <IonTitle>Shopping</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Notifications */}
      <IonCard>
        <IonCardHeader color="tertiary">
          <IonCardSubtitle>Notifications</IonCardSubtitle>
        </IonCardHeader>
        <Notification details="12.04" link='#' peerReview={true} />
        <Notification details="12.04" link='#'peerReview={false} />
      </IonCard>

      {/* Example Cart */}
      <IonCard>
        <IonCardHeader>
              <IonCardTitle>Aldi Einkauf</IonCardTitle>
              <IonCardSubtitle>23.04.22</IonCardSubtitle>
        </IonCardHeader>
        <IonItem>
          <IonButton fill="outline" slot="start">
          <IonIcon slot="start" icon={checkmark} />
            Peer Reviewed
          </IonButton>
        </IonItem>
        <IonItem>
          <IonButton fill="outline" slot="start">
          <IonIcon slot="start" icon={checkmark} />
            Reviewed
          </IonButton>
        </IonItem>
        <IonCardContent>
            This is content, without any paragraph or header tags,
            within an ion-cardContent element.
        </IonCardContent>
      </IonCard>
       {/* Example Cart */}
       <IonCard>
        <IonCardHeader color="warning">
              <IonCardTitle>Netto</IonCardTitle>
              <IonCardSubtitle>18.04.22</IonCardSubtitle>
        </IonCardHeader>
        <IonItem>
          <IonButton fill="outline" slot="start" color="warning">
          <IonIcon slot="start" icon={checkmark} />
            you reviewed
          </IonButton>
        </IonItem>
        <IonCardContent>
            This is content, without any paragraph or header tags,
            within an ion-cardContent element.
        </IonCardContent>
      </IonCard>

    </IonContent>
  </IonPage>
  );
};

export default Tab2;
