import { IonContent, IonHeader, IonPage, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import Header from '../components/Header';
import { Task } from '../models/Task';

const Tab3: React.FC = () => {
  const [segment, setSegment] = useState<Task>();
  return (
    <IonPage>
      <Header title="Wöchentliche Aufgabe" />
      <IonContent fullscreen>
        <IonToolbar class='mb-4'>
          <IonSegment onIonChange={(e) => setSegment(e.detail.value as Task)}>
            <IonSegmentButton value={Task.CERTIFICATE}>{Task.CERTIFICATE}</IonSegmentButton>
            <IonSegmentButton value={Task.REGIONALITY}>{Task.REGIONALITY}</IonSegmentButton>
            <IonSegmentButton value={Task.SEASONALITY}>{Task.SEASONALITY}</IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        <div>
          <h2>{segment}</h2>
        </div>
      </IonContent>
    </IonPage >
  );
};

export default Tab3;
