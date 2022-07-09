import {
  IonContent,
  IonNote,
  IonPage,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { getDoc, doc, where, collection, query, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router';
import { useAuth } from '../service/authFirebase';
import { db } from "../service/firebaseConfig";
import { Purchase as PurchaseModel } from '../models/Purchase';
import Header from '../components/Header';
import { Item } from '../models/Item';
import PurchaseItem from '../components/PurchaseItem';
import PurchaseHeader from '../components/PurchaseHeader';
import { Review } from '../models/Review';
import { ReviewType } from '../models/ReviewType';
import Likert from 'react-likert-scale';
import './Likert.css'



const Purchase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useAuth();
  const [purchase, setPurchase] = useState<PurchaseModel>();
  const [review, setReview] = useState<Review[]>([]);

  useEffect(() => {
    const purchaseDocRef = doc(db, "users", userId ? userId : '0', 'purchases', id);
    const getPurchase = async () => {
      const purchaseSnap = await getDoc(purchaseDocRef);
      setPurchase({ ...purchaseSnap.data() as PurchaseModel, id: purchaseSnap.id });
    }
    getPurchase();
  }, [userId, id]);

  useEffect(() => {
    if (purchase?.reviewed) {
      const q = query(collection(db, "reviews"), where("purchase", "==", purchase.id), where("reviewType", "==", ReviewType.SelfReview));
      const getReview = async () => {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          setReview(doc.data().review as Review[]);
          console.log(review);
        });
      }
      getReview();
    }
  }, [purchase]);


  return (
    <IonPage>
      <Header title="Einkauf" showBackBtn={true} />
      <IonContent className="ion-padding">
        {purchase ? (
          <>
            <PurchaseHeader
              id={"" + purchase.id}
              title={purchase.title}
              date={purchase.date}
              task={purchase.task}
              description={purchase.description}
              overview={true}
              reviewed={purchase.reviewed}
              peerReviewed={purchase.peerReviewed}
              owner={purchase.owner}
            />
            {purchase.items?.map((item: Item, index: number) => {
              return (
                <>
                  <PurchaseItem key={index} item={item} editable={false} />
                  {(review[index]?.rating) ?
                    <Likert id={index + '-' + item.title}
                      className="likertStyles mx-3 my-5"
                      question={"Erfüllt das Thema " + purchase.task + '?'}
                      responses={[
                        { value: 0, text: "stimme gar nicht zu", checked: review[index]?.rating == 0 },
                        { value: 1, text: "", checked: review[index]?.rating == 1 },
                        { value: 2, text: "", checked: review[index]?.rating == 2 },
                        { value: 3, text: "", checked: review[index]?.rating == 3 },
                        { value: 4, text: "", checked: review[index]?.rating == 4 },
                        { value: 5, text: "", checked: review[index]?.rating == 5 },
                        { value: 6, text: "stimme voll und ganz zu", checked: review[index]?.rating == 6 }
                      ]}
                      onClick={(e: { preventDefault: any; }) => e.preventDefault}
                    />
                    : (<p className='ml-4'>Likert Scala konnte nicht geladen werden. <br />Rating: {review[index]?.rating}/7 Punkten</p>)
                  }
                </>
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
