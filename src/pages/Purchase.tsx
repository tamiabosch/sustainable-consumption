import {
  IonCard,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
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
import { chevronDownCircleOutline, peopleOutline, personOutline, refresh } from 'ionicons/icons';



const Purchase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useAuth();
  const [purchase, setPurchase] = useState<PurchaseModel>();
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [peerReview, setPeerReview] = useState<ReviewItem[]>([]);
  const [reviewData, setReviewData] = useState<Review[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);


  useEffect(() => {
    const purchaseDocRef = doc(db, 'purchases', id);
    const getPurchase = async () => {
      const purchaseSnap = await getDoc(purchaseDocRef);
      setPurchase({ ...purchaseSnap.data() as PurchaseModel, id: purchaseSnap.id });
    }
    getPurchase();
  }, [userId, id]);

  //get Review and PeerReview if bool is set to true
  useEffect(() => {
    //get own review data
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
    }

    //if Purchase was peer reviewed query data
    if (purchase?.peerReviewed) {
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
  }, [purchase, refresh]);

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    setRefresh(!refresh);

    setTimeout(() => {
      console.log('Async operation has ended');
      event.detail.complete();

    }, 1000);
  }

  return (
    <IonPage>
      <Header title="Einkauf" showBackBtn={true} />
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Pull to refresh"
            refreshingSpinner="circles"
            refreshingText="Refreshing...">
          </IonRefresherContent>
        </IonRefresher>
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
              peerReviewer={purchase.peerReviewer}
            />
            <p className='px-5 mb-5'>Die Skala geht von 0 ("stimme überhaupt nicht zu") bis 6 ("stimme voll und ganz zu")</p>
            {purchase.items?.map((item: Item, index: number) => {
              return (
                <React.Fragment key={index}>
                  <PurchaseItem item={item} editable={false} />
                  {purchase.reviewed &&
                    <IonCard className='ion-padding'>
                      <div className='flex flex-row items-center mb-2'>
                        <IonIcon icon={personOutline} slot="start" className='w-5 h-5 mr-2' />
                        <IonCardTitle className='text-base'>Deine Bewertung </IonCardTitle>
                      </div>
                      {(review[index]?.rating) ?
                        <Likert id={index + '-self-' + item.title}
                          className="likertStyles disable"
                          layout="stacked"
                          question={"Das Produkt erfüllt das angegebene Nachhaltigkeitsthema " + purchase.task + '.'}
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
                        : (<p>Skala konnte nicht geladen werden. <br />Rating: {review[index]?.rating}/7 Punkten</p>)
                      }
                      {(review[index]?.comment) && <p><b>Kommentar:</b> <br />{review[index]?.comment}</p>}
                    </IonCard>
                  }
                  {purchase.peerReviewed && (
                    <>
                      <IonCard className='ion-padding'>
                        <div className='flex flex-row items-center mb-2'>
                          <IonIcon icon={peopleOutline} slot="start" className='w-6 h-6 mr-2' />
                          <IonCardTitle className='text-base'>Feedback</IonCardTitle>
                        </div>
                        {(peerReview[index]?.rating) ?
                          <Likert id={index + '-peer-' + item.title}
                            className="likertStyles disable"
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
                          : (<p>Likert Scala konnte nicht geladen werden. <br /><b>Rating: {peerReview[index]?.rating}/6 Punkten</b></p>)
                        }
                        {(peerReview[index]?.comment) && <p><b>Kommentar:</b> <br />{peerReview[index]?.comment}</p>}

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
