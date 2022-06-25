import {
    IonContent,
    IonPage,
  } from '@ionic/react';
  import React, { useMemo } from 'react';
  import { useLocation } from 'react-router';
  
  const ExperienceSampling: React.FC = () => {
    const location = useLocation<{ purchaseId: string, reviewId: string }>();
    const purchaseId = useMemo(() => location.state.purchaseId, [location]);
    const reviewId = useMemo(() => location.state.reviewId, [location]);
    console.log("id: " + purchaseId, reviewId);

    return (
      <IonPage>
        <IonContent className="ion-padding">
          Hi there!
        </IonContent>
      </IonPage>
    );
  };
  
  export default ExperienceSampling;
  