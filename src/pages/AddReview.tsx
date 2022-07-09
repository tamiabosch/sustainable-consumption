import { IonButton, IonContent, IonIcon, IonItem, IonItemDivider, IonLabel, IonLoading, IonNote, IonPage, IonText, IonTextarea, IonToast } from '@ionic/react';
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
import './Likert.css'
import { ReviewType } from '../models/ReviewType';
import { ReviewItem } from '../models/Review';


const AddReview: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();

  const location = useLocation<{ purchaseId: string }>();
  //const purchaseId = useMemo(() => location.state.purchaseId, [location]);
  const purchaseId = location.state.purchaseId;
  const [purchase, setPurchase] = useState<PurchaseModel>();
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const purchaseDocRef = doc(db, "users", userId ? userId : '0', 'purchases', purchaseId);
    const getPurchase = async () => {
      const purchaseSnap = await getDoc(purchaseDocRef);
      setPurchase({ ...purchaseSnap.data() as PurchaseModel, id: purchaseSnap.id });
    }
    getPurchase();
  }, [userId, purchaseId]);

  useEffect(() => {
    const rev: ReviewItem[] = []
    purchase?.items?.forEach(item => {
      rev.push({ rating: null, comment: "" })
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

  //if one value of the review arry field rating is null, the review is not complete
  function nullExists(rating: ReviewItem['rating']) {
    return review?.some(function (el) {
      return el.rating === rating;
    });
  }
  const handleReviewSubmit = async () => {
    console.log("Review: " + review,);
    //Check if all fields are filled
    if (!nullExists(null)) {
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
          state: {
            purchaseId: purchaseId,
            reviewId: reviewDocRef.id,
            task: purchase?.task,
            reviewType: ReviewType.SelfReview
          }
        }
        history.replace(location)
      })

    } else {
      setShowToast(true);
      console.log('missing data at handleSave method');
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
          <IonText className='text-left text-base my-4'>Deine Aufgabe ist es die ausgewählten Produkte bezüglich des Nachhaltigkeitsthemas <b>{purchase?.task ? purchase.task : "dieser Woche "}</b> zu  bewertet werden!
            <br /> Schreibe einen Kommentar, um das Rating auch zu einem späteren Zeitpunkt noch nachvollziehen zu können.
          </IonText>
        </IonItemDivider>
        {purchase ? (
          <>
            <PurchaseHeader id={"" + purchase.id} title={purchase.title} date={purchase.date} task={purchase.task} description={purchase.description} owner={purchase.owner} />
            {purchase.items?.map((item: Item, index: number) => (
              <React.Fragment key={index}>
                <IonItemDivider className='mt-10 mb-5' color='primary'>
                  <IonLabel>
                    {index + 1}. Produkt
                  </IonLabel>
                </IonItemDivider>
                <PurchaseItem item={item} editable={false} />
                <Likert id={index + '-' + item.title} className="likertStyles mx-3 my-5" {...likertOptions} question={"Das Produkt erfüllt das angegebene Nachhaltigkeitsthema " + purchase.task + '.'} onChange={(e: any) => handleLikertChange(index, e)} />
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
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Alle Ratings müssen vergeben werden"
          duration={2000}
        />
      </IonContent>
    </IonPage>
  )
}

export default AddReview;