import { IonItem, IonIcon, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonChip, IonLabel } from "@ionic/react";
import { createOutline, enterOutline, exitOutline, checkmark, heart, personOutline } from 'ionicons/icons';
import Label from './Label';
import { format, parseISO } from 'date-fns';
import { Task } from "../models/Task";

interface PurchaseOverviewProps {
  key: number;
  title: string;
  task: Task;
  date: string;
  link: string;
  reviewed: boolean;
  peerReviewed: boolean;
}

const PurchaseOverview: React.FC<PurchaseOverviewProps> = ({ title, link, date, task, reviewed, peerReviewed }) => {
  //add status of purchase review, conditional rendering of labels
  const PurchaseOverview = () => (
    <IonCard routerLink={link}>
      <IonCardHeader>
        {/* <IonIcon className="float-right" icon={createOutline} /> */}
        <IonCardTitle className="text-base">{title}</IonCardTitle>
        <IonCardSubtitle>{format(parseISO(date), 'd MMM, yyyy')}</IonCardSubtitle>
        <IonCardSubtitle>{task}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        {reviewed &&
          <IonChip color="success">
            <IonIcon icon={checkmark} color="dark" />
            <IonLabel>bewertet</IonLabel>
          </IonChip>
        }
        {peerReviewed &&
          <IonChip color="success">
            <IonIcon icon={personOutline} color="dark" />
            <IonLabel>Feedback erhalten</IonLabel>
          </IonChip>
        }
      </IonCardContent>
    </IonCard>
  )
  return <PurchaseOverview />;

};

export default PurchaseOverview;
