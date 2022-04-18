import {IonItem, IonIcon, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent} from "@ionic/react";
import { createOutline, enterOutline, exitOutline, checkmark } from 'ionicons/icons';
import Label  from './Label';

interface PurchaseProps {
    title: string;
    date: string;
    link?: string;
    reviewed: boolean;
    peerReviewed: boolean;
    otherReview?: boolean;
  }
  
  const Purchase: React.FC<PurchaseProps> = ({ title, link, date, reviewed, peerReviewed, otherReview, ...props}) => {
    //add status of purchase review, conditional rendering of labels
    const Purchase = () => {
        return (
          <IonCard>
            <IonCardHeader>
                  <IonIcon className="float-right" icon={createOutline} />
                  <IonCardTitle>{title}</IonCardTitle>
                  <IonCardSubtitle>{date}</IonCardSubtitle>
            </IonCardHeader>
            <IonItem>
                { 
                  reviewed && 
                  <Label text="bewertet" link={link ? link : '#'} > 
                    <IonIcon slot="start" icon={checkmark} /> 
                  </Label> 
                  }
                { 
                  peerReviewed && 
                  <Label text="Feedback erhalten" link={link ? link : '#'} icon="enterOutline">
                    <IonIcon slot="start" icon={enterOutline} /> 
                  </Label> 
                }
                { 
                  otherReview && 
                  <Label text="Feedback gegeben" link={link ? link : '#'} icon="enterOutline">
                    <IonIcon slot="start" icon={exitOutline} /> 
                  </Label>
                }
            </IonItem>
            <IonCardContent>
                This is content, without any paragraph or header tags,
                within an ion-cardContent element.
            </IonCardContent>
          </IonCard>
        );
    }
    return <Purchase />;

  };
  
  export default Purchase;
  