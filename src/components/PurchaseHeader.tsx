import { IonCard, IonCardHeader, IonItem, IonIcon, IonLabel, IonCardTitle, IonCardSubtitle, IonCardContent, IonChip } from "@ionic/react";
import { format, parseISO } from "date-fns";
import { cartOutline, checkmark, personOutline } from "ionicons/icons";
import { Task } from "../models/Task";


interface PurchaseHeaderProps {
    title: string;
    date: string;
    task: Task;
    description?: string;
    link?: string; //Apparently, for certain attributes, React is intelligent enough to omit the attribute if the value you pass to it is not truthy.
    overview?: {
        reviewed: boolean;
        peerReviewed: boolean;
    }
}

const PurchaseHeader: React.FC<PurchaseHeaderProps> = ({ title, date, task, description, link, overview }) => (
    <IonCard routerLink={link}>
        <IonCardHeader>
            <IonItem className="ion-activated">
                <IonIcon icon={cartOutline} slot="start" />
                <IonLabel>
                    <IonCardTitle>{title}</IonCardTitle>
                    <IonCardSubtitle>{format(parseISO(date), 'd MMM, yyyy')}</IonCardSubtitle>
                    <IonCardSubtitle>{task}</IonCardSubtitle>
                </IonLabel>
            </IonItem>
        </IonCardHeader>
        {description && <IonCardContent>{description}</IonCardContent>}
        {overview &&
            <IonCardContent>
                {overview.reviewed &&
                    <IonChip color="success">
                        <IonIcon icon={checkmark} color="dark" />
                        <IonLabel>bewertet</IonLabel>
                    </IonChip>}
                {overview.peerReviewed &&
                    <IonChip color="success">
                        <IonIcon icon={personOutline} color="dark" />
                        <IonLabel>Feedback erhalten</IonLabel>
                    </IonChip>}
            </IonCardContent>}
    </IonCard>
)

export default PurchaseHeader;