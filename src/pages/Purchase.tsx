import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { useParams } from 'react-router';
import { useAuth } from '../service/authFirebase';
import { db } from "../service/firebaseConfig";
import { format, parseISO } from 'date-fns';
import { Purchase as PurchaseModel } from '../models/Purchase';
import Header from '../components/Header';
import { Item } from '../models/Item';
import PurchaseItem from '../components/PurchaseItem';
import { cartOutline } from 'ionicons/icons';



const Purchase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useAuth();
  const [purchase, setPurchase] = useState<PurchaseModel>();

  useEffect(() => {
    const purchaseDocRef = doc(db, "users", userId ? userId : '0', 'purchases', id);
    const getPurchase = async () => {
      const purchaseSnap = await getDoc(purchaseDocRef);
      setPurchase({ ...purchaseSnap.data() as PurchaseModel, id: +purchaseSnap.id });
    }
    getPurchase();
  }, [userId, id]);

  return (
    <IonPage>
      <Header title="Einkauf" showBackBtn={true} />
      <IonContent className="ion-padding">
        {purchase ? (
          <>
            <IonCard>
              <IonCardHeader>
                <IonItem className="ion-activated">
                  <IonIcon icon={cartOutline} slot="start" />
                  <IonLabel>
                    <IonCardTitle>{purchase.title}</IonCardTitle>
                    <IonCardSubtitle>{format(parseISO(purchase.date), 'd MMM, yyyy')}</IonCardSubtitle>
                    <IonCardSubtitle>{purchase.task}</IonCardSubtitle>
                  </IonLabel>
                </IonItem>
              </IonCardHeader>
              <IonCardContent>
                {purchase.description}
              </IonCardContent>
            </IonCard>

            {purchase.items.map((item: Item, index: number) => {
              return (
                <PurchaseItem key={index} item={item} editable={false} />
              );
            })}
          </>
        ) :
          (<IonNote>Einkauf konnte nicht geladen werden.</IonNote>)
        }
      </IonContent>
    </IonPage>
  );
};

export default Purchase;
