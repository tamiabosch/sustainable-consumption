import { IonButton, IonContent, IonHeader, IonIcon, IonLoading, IonNote, IonPage, IonText, IonTitle, IonToolbar, SelectChangeEventDetail, SelectCustomEvent } from '@ionic/react';
import { id } from 'date-fns/locale';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState, useMemo, useRef, ChangeEventHandler } from 'react';
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

type Review = {
  rating: number;
  comment?: string;
}

const AddReview: React.FC = () => {
  const location = useLocation<{ purchaseId: string }>();
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
      rev.push({rating: 0, comment: ""})
    });
    setReview(rev);
  }, [purchase]);


  const likertOptions = {
    responses: [
      { value: 1, text: "stimme gar nicht zu" },
      { value: 2, text: "" },
      { value: 3, text: "" },
      { value: 4, text: "" },
      { value: 5, text: "" },
      { value: 6, text: "" },
      { value: 7, text: "stimme voll und ganz zu" }
    ],
    onChange: (val: any) => {
      console.log(val);
    }
  };
  const likertRef = useRef();

  if (!purchaseId) {
    return <IonLoading isOpen />;
  }
  const handleLikertChange = (index: number, e: {value: number, text: string}) => {
    console.log("wat " + index, e.value);

    let newArr = [...review]; // copying the old datas array
    newArr[index].rating = e.value;
    setReview(newArr);
    console.log("review: " + review, newArr);
  }
  const handleReviewSubmit = () => {
    console.log("submit")

  }

  return (
    <IonPage>
      <Header title='Review' />
      <div className='p-4 bg-slate-900'>
        <IonText className='text-left text-base'>Die ausgewählten Produkte sollen jetzt bezüglich des Nachhaltigkeitsthemas <b>{purchase?.task ? purchase.task : "dieser Woche "}</b> bewertet werden!
          <br />
          Ein Kommentar hilft das ausgewählte Rating besser nachvollziehen zu können.
          Vor allem wenn der Einkauf zu einem späteren Zeitpunkt angeschaut wird.</IonText>
      </div>
      <IonContent>
        {purchase ? (
          <>
            <PurchaseHeader title={purchase.title} date={purchase.date} task={purchase.task} description={purchase.description} />
            {purchase.items.map((item: Item, index: number) => (
              <>
                <PurchaseItem key={item.id ? item.id : index} item={item} editable={false} />
                <Likert key={index + "-likert"} id={index} className="likertStyles m-2" {...likertOptions} ref={likertRef} question={"Erfüllt dieses Produkt das Thema " + purchase.task + '?'} onChange={(e: any) => handleLikertChange(index, e)} />
              </>
            ))}
          </>
        ) : (
          <IonNote>Einkauf konnte nicht geladen werden.</IonNote>
        )}
        <IonButton className='uppercase' onClick={handleReviewSubmit} expand="block">
          <IonIcon slot="start" icon={saveOutline} /> Einkauf speichern
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default AddReview;


export const addStyle = () => {
  console.log('addStyle')
  const labels: NodeListOf<HTMLLabelElement> = document.querySelectorAll('.likertResponse')
  labels.forEach(function (label) {
    label.style.minWidth = "0px"
  });

  const labelTexts: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.likertText')
  labelTexts[0].style.paddingRight = '0px'
  labelTexts[0].style.paddingLeft = '4px'
  labelTexts[6].style.paddingLeft = '0px'
  labelTexts[6].style.paddingRight = '4px'

  const questionText: NodeListOf<HTMLDivElement> = document.querySelectorAll('.likertLegend')
  questionText.forEach(function (text) {
    text.classList.add('ml-')
  })
}