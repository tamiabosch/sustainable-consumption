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
import React, { useState } from 'react';
import { useLocation } from 'react-router';
import Header from '../components/Header';
import Likert from 'react-likert-scale';
import { sendOutline } from 'ionicons/icons';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../service/authFirebase';
import { db } from '../service/firebaseConfig';
import { useHistory } from 'react-router';
import { ReviewType } from '../models/ReviewType';



const AddExperienceSampling: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();

  const location = useLocation<{ purchaseId: string, reviewId: string, task: string, reviewType: ReviewType, reviewTypeUser: ReviewType }>();
  const purchaseId = location.state?.purchaseId;
  const reviewId = location.state?.reviewId;
  const task = location.state?.task;
  const reviewType = location.state?.reviewType;
  const reviewTypeUser = location.state?.reviewTypeUser;

  console.log('location: ' + location, location)
  console.log('task: ' + task)

  const [selected_1, setSelected_1] = useState<string>('');
  const [selected_2, setSelected_2] = useState<string>('');
  const [selected_3, setSelected_3] = useState<string>('-1');
  const [selected_4, setSelected_4] = useState<string>('-1');
  const [selected_5, setSelected_5] = useState<string>('-1');

  const [freeText_1, setFreeText_1] = useState<string>();
  const [showToast, setShowToast] = useState(false);


  const handleCommentChange = (e: any, index: number) => {
    const value = e.target.value
    if (1) {
      setFreeText_1(value)
    }
  }
  const responses = [
    { value: 0, text: "0" },
    { value: 1, text: "1" },
    { value: 2, text: "2" },
    { value: 3, text: "3" },
    { value: 4, text: "4" },
    { value: 5, text: "5" },
    { value: 6, text: "6" }
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
    console.log('5: ', selected_1, freeText_1)
    console.log('onsubmit: ', task, reviewType)

    if (selected_1 && selected_2 && ((selected_3 && selected_4 && selected_5) !== '-1')) {
      const textBug = freeText_1 ? freeText_1 : 'Sonstiges'
      const entryData = {
        author: userId,
        created_at: serverTimestamp(),
        purchase: purchaseId,
        q1: { question: questions.q1.question, answer: (selected_1 === 'Sonstiges') ? textBug : selected_1 },
        q2: { question: questions.q2.question, answer: selected_2 },
        q3: { question: questions.q3.question, answer: selected_3 },
        q4: { question: questions.q4.question, answer: selected_4 },
        q5: { question: questions.q5.question, answer: selected_5 },
        review: reviewId,
        task,
        reviewTypeUser
        //reviewType,
        //TODO add timer
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
        reviewType === ReviewType.SelfReview ? history.replace('/user/tab1') : history.replace('/user/tab2');
      }

    } else {
      setShowToast(true);
      console.log('missing data at handelSubmit ExperienceSample:');
      console.log('1: ', selected_1)
      console.log('2: ', selected_2)
      console.log('3: ', selected_3)
      console.log('4: ', selected_4)
      console.log('5: ', selected_5)
    }

  }


  return (
    <IonPage>
      <Header title='Experience Sampling' />
      <IonContent>
        <IonItemDivider color='primary'>
          <IonText className='text-left text-base my-4'>
            Folgende Fragen helfen die vorherige Bewertung besser in Kontext zu bringen.
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
              <IonLabel className='text-base'>{questions.q2.question + ' (' + task + ')'}</IonLabel>
            </IonListHeader>
            <IonItem>
              <IonText className='py-2 text-sm'>{questions.q2.answers.a1}</IonText>
              <IonRadio slot="start" value={questions.q2.answers.a1} />
            </IonItem>
            <IonItem>
              <IonText className='py-2 text-sm'>{questions.q2.answers.a2}</IonText>
              <IonRadio slot="start" value={questions.q2.answers.a2} />
            </IonItem>
            <IonItem>
              <IonText className='py-2 text-sm'>{questions.q2.answers.a3}</IonText>
              <IonRadio slot="start" value={questions.q2.answers.a3} />
            </IonItem>
            <IonItem>
              <IonText className='py-2 text-sm'>{questions.q2.answers.a4}</IonText>
              <IonRadio slot="start" value={questions.q2.answers.a4} />
            </IonItem>
          </IonRadioGroup>
        </IonList>

        <p className='px-4 my-5 text-sm'>Die Skala geht von 0 ("stimme überhaupt nicht zu") bis 6 ("stimme voll und ganz zu")</p>

        {/* Frage 3 */}
        <Likert id="likert-3" className="likertStyles mx-3 my-8" {...likertOptions} question={questions.q3.question} onChange={(e: any) => setSelected_3(e.value)} />
        {/* Frage 4 */}
        <Likert id="likert-4" className="likertStyles mx-3 my-8" {...likertOptions} question={questions.q4.question} onChange={(e: any) => setSelected_4(e.value)} />
        {/* Frage 5 */}
        <Likert id="likert-5" className="likertStyles mx-3 my-8" {...likertOptions} question={questions.q5.question} onChange={(e: any) => setSelected_5(e.value)} />
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
