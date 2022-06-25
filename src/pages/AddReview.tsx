import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonLabel, IonLoading, IonNote, IonPage, IonText, IonTextarea, IonTitle, IonToolbar, SelectChangeEventDetail, SelectCustomEvent } from '@ionic/react';
import { collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';
import Header from '../components/Header';
import { db } from '../service/firebaseConfig';
import { useAuth } from './../service/authFirebase';
import { Purchase as PurchaseModel } from '../models/Purchase';
import PurchaseHeader from '../components/PurchaseHeader';
import { Item } from '../models/Item';
import PurchaseItem from '../components/PurchaseItem';
import Likert from 'react-likert-scale';
import { saveOutline } from 'ionicons/icons';
import './AddReview.css'
import { ReviewType } from '../models/ReviewType';

type Review = {
  rating: number;
  comment?: string;
}

const AddReview: React.FC = () => {
  const location = useLocation<{ purchaseId: string }>();
  const history = useHistory();
  const purchaseId = useMemo(() => location.state.purchaseId, [location]);
  console.log("id: " + purchaseId);
  const { userId } = useAuth();
  const [purchase, setPurchase] = useState<PurchaseModel>();
  const [review, setReview] = useState<Review[]>([]);

  useEffect(() => {
    const purchaseDocRef = doc(db, "users", userId ? userId : '0', 'purchases', purchaseId);
    const getPurchase = async () => {
      const purchaseSnap = await getDoc(purchaseDocRef);
      setPurchase({ ...purchaseSnap.data() as PurchaseModel, id: +purchaseSnap.id });
    }
    getPurchase();

  }, [userId, purchaseId]);

  useEffect(() => {
    const rev: Review[] = []
    purchase?.items.forEach(item => {
      rev.push({ rating: -1, comment: "" })
    });
    setReview(rev);
  }, [purchase]);


  const likertOptions = {
    responses: [
      { value: 0, text: "stimme gar nicht zu" },
      { value: 1, text: "" },
      { value: 2, text: "" },
      { value: 3, text: "" },
      { value: 4, text: "" },
      { value: 5, text: "" },
      { value: 6, text: "stimme voll und ganz zu" }
    ],
    onChange: (val: any) => {
      console.log(val);
    }
  };

  //set likert value in review array based on index
  const handleLikertChange = (index: number, e: { value: number, text: string }) => {
    let newArr = [...review]; // copying the old datas array
    newArr[index].rating = e.value;
    setReview(newArr);
    console.log(e);
  }
  //set comment in Review Arry position current index
  const handleCommentChange = (e: any, index: number) => {
    const value = e.target.value
    if (value) {
      let newArr = [...review]; // copying the old datas array
      newArr[index].comment = value;
      setReview(newArr);
      console.log(newArr);
    }
  }

  const handleReviewSubmit = async () => {
    console.log("Review: " + review,);
    if (purchase) {
      //TODO add timer??
      const entryData = {
        created_at: serverTimestamp(),
        author: userId,
        task: purchase?.task,
        purchase: purchaseId,
        items: purchase?.items,
        review: review,
        reviewType: ReviewType.SelfReview
      }
      const reviewCol = collection(db, 'reviews');
      const reviewDocRef = doc(reviewCol);
      //save doc to db
      const saveReviewtoFB = async () => {
        //set review to db
        await setDoc(reviewDocRef, entryData);
        //update purchase reviewed to true
        const purchaseDocRef = doc(db, "users", userId ? userId : '0', 'purchases', purchaseId);
        await updateDoc(purchaseDocRef, {
          reviewed: true
        });
      }
      saveReviewtoFB().then(() => {
        const location = {
          pathname: '/user/tab1/add/experienceSampling',
          state: { purchaseId: purchaseId, reviewId: reviewDocRef.id, }
        }
        history.replace(location)
      })


    } else {
      console.log("can't access purchase");
    }
  }

  if (!purchaseId) {
    return <IonLoading isOpen />;
  }
  return (
    <IonPage>
      <Header title='Review' />
      <IonContent>
        <IonItemDivider color='primary'>
          <IonText className='text-left text-base my-4'>Die ausgewählten Produkte sollen jetzt bezüglich des Nachhaltigkeitsthemas <b>{purchase?.task ? purchase.task : "dieser Woche "}</b> bewertet werden!
            <br />
            Ein Kommentar hilft das ausgewählte Rating besser nachvollziehen zu können.
            Vor allem wenn der Einkauf zu einem späteren Zeitpunkt angeschaut wird.
          </IonText>
        </IonItemDivider>
        {purchase ? (
          <>
            <PurchaseHeader title={purchase.title} date={purchase.date} task={purchase.task} description={purchase.description} />
            {purchase.items.map((item: Item, index: number) => (
              <React.Fragment key={index}>
                <IonItemDivider className='mt-10 mb-5' color='primary'>
                  <IonLabel>
                    {index + 1}. Produkt
                  </IonLabel>
                </IonItemDivider>
                <PurchaseItem item={item} editable={false} />
                <Likert id={index + '-' + item.title} className="likertStyles mx-3 my-5" {...likertOptions} question={"Erfüllt dieses Produkt das Thema " + purchase.task + '?'} onChange={(e: any) => handleLikertChange(index, e)} />
                <IonItem>
                  <IonLabel position="stacked">Kommentar</IonLabel>
                  <IonTextarea placeholder="Bewertung genauer beschreiben..." value={review[index]?.comment ? review[index].comment : ""} onIonChange={(e) => handleCommentChange(e, index)} />
                </IonItem>
              </React.Fragment>
            ))}
          </>
        ) : (
          <IonNote>Einkauf konnte nicht geladen werden.</IonNote>
        )}
        <IonButton className='uppercase mt-10' onClick={handleReviewSubmit} expand="block">
          <IonIcon slot="start" icon={saveOutline} /> Einkauf speichern
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default AddReview;