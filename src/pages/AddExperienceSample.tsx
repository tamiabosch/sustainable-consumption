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


const AddExperienceSampling: React.FC = () => {
  const location = useLocation<{ purchaseId: string, reviewId: string }>();
  const purchaseId = useMemo(() => location.state.purchaseId, [location]);
  const reviewId = useMemo(() => location.state.reviewId, [location]);

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
      console.log("onChange Likert: ",val);
    }
  };
  const handleSubmit = async () =>{
    if(selected_1 && selected_2 && selected_3 && selected_4 && selected_5) {
      const entryDate = {
        created_at: serverTimestamp(),

      }

    } else {
      setShowToast(true);
      console.log('missing data at handelSubmit ExperienceSample method');
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
              <IonText className='py-2 text-sm'>Zu wenig Produkte zur eingekauft, das was übrig ist wurde ausgewählt</IonText>
              <IonRadio slot="start" value="Zu wenig Produkte zur eingekauft, das was übrig ist wurde ausgewählt" />
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
          { (selected_1 === 'Sonstiges') && (
            <IonItem>
              <IonLabel position="stacked">Erklärung</IonLabel>
              <IonTextarea placeholder="Bitte genauer erläutern..." onIonChange={(e) => handleCommentChange(e, 1)} />
            </IonItem>
            )}
        </IonList>

        {/* Frage 2 */}
        <IonList className='ion-margin'>
          <IonRadioGroup value={selected_1} onIonChange={e => setSelected_2(e.detail.value)}>
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

        <Likert id="likert-3" className="likertStyles mx-3 my-8" {...likertOptions} question="Ich habe fundiertes Wissen in dem aktuellen wöchentlichen Thema." onChange={(e: any) => setSelected_3(e.val)} />
        {/* Frage 4 */}
        <Likert id="likert-4" className="likertStyles mx-3 my-8" {...likertOptions} question="Es fiel mir leicht, die Produkte entsprechend der wöchentlichen Aufgabe zu bewerten." onChange={(e: any) => setSelected_4(e.val)} />
        {/* Frage 5 */}
        <Likert id="likert-5" className="likertStyles mx-3 my-8" {...likertOptions} question="Ich habe mir bei der Produktbewertung Mühe gegeben." onChange={(e: any) => setSelected_5(e.val)} />
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
  }
}
