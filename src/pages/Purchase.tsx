import {
  IonCard,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
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
import { Review, ReviewItem } from '../models/Review';
import { ReviewType } from '../models/ReviewType';
import Likert from 'react-likert-scale';
import './Likert.css'
import { peopleOutline, personOutline } from 'ionicons/icons';



const Purchase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useAuth();
  const [purchase, setPurchase] = useState<PurchaseModel>();
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [reviewData, setReviewData] = useState<Review[]>([]);
  const [peerReview, setPeerReview] = useState<ReviewItem[]>([]);

  useEffect(() => {
    const purchaseDocRef = doc(db, 'purchases', id);
    const getPurchase = async () => {
      const purchaseSnap = await getDoc(purchaseDocRef);
      setPurchase({ ...purchaseSnap.data() as PurchaseModel, id: purchaseSnap.id });
    }
    getPurchase();
  }, [userId, id]);

  useEffect(() => {
    //get Review and PeerReview if bool is set to true
    if (purchase?.reviewed) {
      const q = query(collection(db, "reviews"), where("purchase", "==", purchase.id), where("reviewType", "==", ReviewType.SelfReview));
      const getReview = async () => {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          //hier wird nur Array aus review und comment gespeichert
          setReview(doc.data().review as ReviewItem[]);
          //hier ganze Review mit author und ReviewType 
          setReviewData(doc.data() as Review[]);
          console.log(reviewData);
        });
      }
      getReview();
    } else if (purchase?.peerReviewed) {
      const q = query(collection(db, "reviews"), where("purchase", "==", purchase.id), where("reviewType", "==", ReviewType.PeerReview));
      const getPeerReview = async () => {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          //hier wird nur Array aus review und comment gespeichert
          setPeerReview(doc.data().review as ReviewItem[]);
        });
      }
      getPeerReview();
    }
  }, [purchase]);


  return (
    <IonPage>
      <Header title="Einkauf" showBackBtn={true} />
      <IonContent className="ion-padding">
        {purchase ? (
          <>
            <PurchaseHeader
              id={purchase.id}
              title={purchase.title}
              date={purchase.date}
              task={purchase.task}
              description={purchase.description}
              overview={true}
              reviewed={purchase.reviewed}
              peerReviewed={purchase.peerReviewed}
              owner={purchase.owner}
            />
            <p className='px-5 mb-5'>Die Skala von 0 ("stimme überhaupt nicht zu") bis 6 ("stimme voll und ganz zut"), gibt die Bewertung des Produkts zum jeweiligen Nachhaltigkeitsthema wieder.</p>
            {purchase.items?.map((item: Item, index: number) => {
              return (
                <React.Fragment key={index}>
                  <PurchaseItem item={item} editable={false} />
                  {purchase.reviewed &&
                    <IonCard className='ion-padding'>
                      <div className='flex flex-row items-center mb-2'>
                        <IonIcon icon={personOutline} slot="start" className='w-5 h-5 mr-2' />
                        <IonCardTitle className='text-lg'>Deine Bewertung </IonCardTitle>
                      </div>
                      {(review[index]?.rating) ?
                        <Likert id={index + '-' + item.title}
                          className="likertStyles disable"
                          layout="stacked"
                          question={"Deine Bewertung des Produkts zum " + purchase.task + '?'}
                          responses={[
                            { value: 0, text: "0", checked: review[index].rating === 0 },
                            { value: 1, text: "1", checked: review[index].rating === 1 },
                            { value: 2, text: "2", checked: review[index].rating === 2 },
                            { value: 3, text: "3", checked: review[index].rating === 3 },
                            { value: 4, text: "4", checked: review[index].rating === 4 },
                            { value: 5, text: "5", checked: review[index].rating === 5 },
                            { value: 6, text: "6", checked: review[index].rating === 6 }
                          ]}
                        />
                        : (<p>Likert Scala konnte nicht geladen werden. <br />Rating: {review[index]?.rating}/7 Punkten</p>)
                      }
                      {(review[index]?.comment) && <p><b>Kommentar:</b> <br />{review[index]?.comment}</p>}
                    </IonCard>
                  }
                  {purchase.peerReviewed && (
                    <>
                      <IonCard>
                        <IonItem >
                          <IonIcon icon={peopleOutline} slot="start" />
                          <IonLabel>Feedback</IonLabel>
                        </IonItem>
                        {(peerReview[index]?.rating) ?
                          <Likert id={index + '-' + item.title}
                            className="likertStyles disable mx-3 my-5"
                            layout="stacked"
                            question={"Feedback des Produkts zum " + purchase.task + '?'}
                            responses={[
                              { value: 0, text: "0", checked: peerReview[index].rating === 0 },
                              { value: 1, text: "1", checked: peerReview[index].rating === 1 },
                              { value: 2, text: "2", checked: peerReview[index].rating === 2 },
                              { value: 3, text: "3", checked: peerReview[index].rating === 3 },
                              { value: 4, text: "4", checked: peerReview[index].rating === 4 },
                              { value: 5, text: "5", checked: peerReview[index].rating === 5 },
                              { value: 6, text: "6", checked: peerReview[index].rating === 6 }
                            ]}
                          />
                          : (<p className='ml-4 mx-2'>Likert Scala konnte nicht geladen werden. <br /><b>Rating: {peerReview[index]?.rating}/7 Punkten</b></p>)
                        }
                        {(peerReview[index]?.comment) && <p className='ml-4 my-4'><b>Kommentar:</b> <br />{peerReview[index]?.comment}</p>}

                      </IonCard>
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </>
        ) :
          (<IonNote>Einkauf konnte nicht geladen werden.</IonNote>)
        }
      </IonContent>
    </IonPage >
  );
};

export default Purchase;
