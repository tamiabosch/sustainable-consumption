import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonText,
  IonTextarea,
  IonToast,
} from '@ionic/react';
import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import Header from '../components/Header';
import Likert from 'react-likert-scale';
import { sendOutline } from 'ionicons/icons';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../service/authFirebase';
import { db } from '../service/firebaseConfig';
import { useHistory } from 'react-router';



const AddExperienceSampling: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();

  const location = useLocation<{ purchaseId: string, reviewId: string, task: string, reviewType: string }>();
  const purchaseId = useMemo(() => location.state.purchaseId, [location]);
  const reviewId = useMemo(() => location.state.reviewId, [location]);
  const task = useMemo(() => location.state.task, [location]);
  const reviewType = useMemo(() => location.state.reviewType, [location]);

  const [selected_1, setSelected_1] = useState<string>('');
  const [selected_2, setSelected_2] = useState<string>('');
  const [selected_3, setSelected_3] = useState<string>('');
  const [selected_4, setSelected_4] = useState<string>('');
  const [selected_5, setSelected_5] = useState<string>('');

  const [freeText_1, setFreeText_1] = useState<string>('');
  const [showToast, setShowToast] = useState(false);


  const handleCommentChange = (e: any, index: number) => {
    const value = e.target.value
    if (1) {
      setFreeText_1(value)
    }
  }
  const responses = [
    { value: 0, text: "stimme gar nicht zu" },
    { value: 1, text: "" },
    { value: 2, text: "" },
    { value: 3, text: "" },
    { value: 4, text: "" },
    { value: 5, text: "" },
    { value: 6, text: "stimme voll und ganz zu" }
  ]
  const likertOptions = {
    responses: responses,
    onChange: (val: { value: number, text: string }) => {
      console.log("onChange Likert: ", val);
      console.log('selected_1: ', selected_1);
      console.log('selected_2: ', selected_2);
      console.log('selected_3: ', selected_3);
      console.log('selected_4: ', selected_4);
      console.log('selected_5: ', selected_5);
    }
  };
  const handleSubmit = async () => {
    if (selected_1 && selected_2 && selected_3 && selected_4 && selected_5) {
      const entryData = {
        created_at: serverTimestamp(),
        q1: { question: questions.q1.question, answer: (selected_1 === 'Sonstiges') ? freeText_1 : selected_1 },
        q2: { question: questions.q2.question, answer: selected_2 },
        q3: { question: questions.q3.question, answer: selected_3 },
        q4: { question: questions.q4.question, answer: selected_4 },
        q5: { question: questions.q5.question, answer: selected_5 },
        purchase: purchaseId,
        review: reviewId,
        author: userId,
        // task,
        // reviewType,
        timeUsed: 0,
      }
      const entriesRef = collection(db, 'experienceSamples');
      const docRef = doc(entriesRef);
      const setPurchaseToFB = async () => {
        await setDoc(docRef, entryData)
        return true
      }
      const result = await setPurchaseToFB();
      if (result) {
        //   const location = {
        //     pathname: '/user/tab1',
        //   }
        //   history.replace(location)
        //  history.goBack();
        history.replace('/user/tab1');
      }

    } else {
      setShowToast(true);
      console.log('missing data at handelSubmit ExperienceSample method', selected_1, selected_2, selected_3, selected_4, selected_5);
    }

  }


  return (
    <IonPage>
      <Header title='Experience Sampling' />
      <IonContent>
        <IonItemDivider color='primary'>
          <IonText className='text-left text-base my-4'>
            Folgende Fragen helfen die vorherige Review besser in Kontext zu bringen.
          </IonText>
        </IonItemDivider>
        {/* Frage 1 */}
        <IonList className='ion-margin'>
          <IonRadioGroup value={selected_1} onIonChange={e => setSelected_1(e.detail.value)}>
            <IonListHeader>
              <IonLabel className='text-base'>{questions.q1.question}</IonLabel>
            </IonListHeader>
            <IonItem>
              <IonText className='py-2 text-sm'>{questions.q1.answers.a1}</IonText>
              <IonRadio slot="start" value={questions.q1.answers.a1} />
            </IonItem>
            <IonItem>
              <IonText className='py-2 text-sm'>Produkte zu denen ich spezifisch Feedback erhalten möchte</IonText>
              <IonRadio slot="start" value="Produkte zu denen ich spezifisch Feedback erhalten möchte" />
            </IonItem>
            <IonItem>
              <IonText className='py-2 text-sm'>Sonstiges</IonText>
              <IonRadio slot="start" value="Sonstiges" />
            </IonItem>
          </IonRadioGroup>
          {(selected_1 === 'Sonstiges') && (
            <IonItem>
              <IonLabel position="stacked">Erklärung</IonLabel>
              <IonTextarea placeholder="Bitte genauer erläutern..." onIonChange={(e) => handleCommentChange(e, 1)} />
            </IonItem>
          )}
        </IonList>

        {/* Frage 2 */}
        <IonList className='ion-margin'>
          <IonRadioGroup value={selected_2} onIonChange={e => setSelected_2(e.detail.value)}>
            <IonListHeader>
              <IonLabel className='text-base'>War das wöchentliche Nachhaltigkeitsthema beim Einkauf bekannt?</IonLabel>
            </IonListHeader>
            <IonItem>
              <IonText className='py-2 text-sm'>Ja, ich habe mich davor genauer über das Thema informiert.</IonText>
              <IonRadio slot="start" value="Ja, ich habe mich davor genauer über das Thema informiert." />
            </IonItem>
            <IonItem>
              <IonText className='py-2 text-sm'>Ja, ich habe mit meinem vorhandenen Wissen darauf geachtet.</IonText>
              <IonRadio slot="start" value="Ja, ich habe mit meinem vorhandenen Wissen darauf geachtet." />
            </IonItem>
            <IonItem>
              <IonText className='py-2 text-sm'>Ja, aber ich habe nicht darauf geachtet.</IonText>
              <IonRadio slot="start" value="Ja, aber ich habe nicht darauf geachtet." />
            </IonItem>
            <IonItem>
              <IonText className='py-2 text-sm'>Nein</IonText>
              <IonRadio slot="start" value="Nein" />
            </IonItem>
          </IonRadioGroup>
        </IonList>
        {/* Frage 3 */}

        <Likert id="likert-3" className="likertStyles mx-3 my-8" {...likertOptions} question="Ich habe fundiertes Wissen in dem aktuellen wöchentlichen Thema." onChange={(e: any) => setSelected_3(e.value)} />
        {/* Frage 4 */}
        <Likert id="likert-4" className="likertStyles mx-3 my-8" {...likertOptions} question="Es fiel mir leicht, die Produkte entsprechend der wöchentlichen Aufgabe zu bewerten." onChange={(e: any) => setSelected_4(e.value)} />
        {/* Frage 5 */}
        <Likert id="likert-5" className="likertStyles mx-3 my-8" {...likertOptions} question="Ich habe mir bei der Produktbewertung Mühe gegeben." onChange={(e: any) => setSelected_5(e.value)} />
        <IonButton className='uppercase mt-10' onClick={handleSubmit} expand="block">
          <IonIcon slot="start" icon={sendOutline} /> Fragebogen abschicken
        </IonButton>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Alle Fragen müssen beantwortet werden"
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};



export default AddExperienceSampling;

export const questions = {
  q1: {
    question: "Nach welchem Schema hast du die Produkte ausgewählt?",
    answers: {
      a1: "Produkte die das Thema am besten erfüllen",
      a2: "Zu wenig Produkte zur eingekauft, das was übrig ist wurde ausgewählt",
      a3: "Produkte zu denen ich spezifisch Feedback erhalten möchte",
      a4: "Sonstiges"
    }
  },
  q2: {
    question: "War das wöchentliche Nachhaltigkeitsthema beim Einkauf bekannt?",
    answers: {
      a1: "Ja, ich habe mich davor genauer über das Thema informiert.",
      a2: "Ja, ich habe mit meinem vorhandenen Wissen darauf geachtet.",
      a3: "Ja, aber ich habe nicht darauf geachtet.",
      a4: "Nein"
    }
  },
  q3: {
    question: "Ich habe fundiertes Wissen in dem aktuellen wöchentlichen Thema.",
  },
  q4: {
    question: "Es fiel mir leicht, die Produkte entsprechend der wöchentlichen Aufgabe zu bewerten.",
  },
  q5: {
    question: "Ich habe mir bei der Produktbewertung Mühe gegeben.",
  }
}
