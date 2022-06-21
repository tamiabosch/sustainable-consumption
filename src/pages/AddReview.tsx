import { IonLoading, IonPage } from '@ionic/react';
import React from 'react';
import { useLocation } from 'react-router';
import { useAuth } from './../service/authFirebase';

const AddReview: React.FC = () => {
    const location = useLocation<{purchaseId: string}>();
    if (!location.state.purchaseId) {
        return <IonLoading isOpen />;
    } else {
        return (
            <IonPage>
    
                <p>{location.state.purchaseId}</p>
            </IonPage>
        )
    }
}
export default AddReview;