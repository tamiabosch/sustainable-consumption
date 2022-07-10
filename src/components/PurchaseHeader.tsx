import { IonCard, IonCardHeader, IonItem, IonIcon, IonLabel, IonCardTitle, IonCardSubtitle, IonCardContent, IonChip } from "@ionic/react";
import { format, parseISO } from "date-fns";
import { cartOutline, checkmark, personOutline, warningOutline } from "ionicons/icons";
import { useHistory } from 'react-router';
import { Purchase } from "../models/Purchase";


const PurchaseHeader: React.FC<Purchase> = ({ id, title, date, task, description, link, overview, peerReviewed, reviewed }) => {
    const history = useHistory();
    console.log('purchaseID:', id)

    const handleFeedbackClick = () => {
        const location = {
            pathname: '/user/tab1/add/review',
            state: { purchaseId: id }
        }
        history.replace(location)
        console.log("Feedback" + id);
    }
    return (
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
                    {reviewed ?
                        (<IonChip color="success">
                            <IonIcon icon={checkmark} color="dark" />
                            <IonLabel>bewertet</IonLabel>
                        </IonChip>) :
                        (<IonChip color="warning" onClick={handleFeedbackClick} >
                            <IonIcon icon={warningOutline} color="dark" />
                            <IonLabel>Einkauf bewerten</IonLabel>
                        </IonChip>)}
                    {peerReviewed &&
                        <IonChip color="success">
                            <IonIcon icon={personOutline} color="dark" />
                            <IonLabel>Feedback erhalten</IonLabel>
                        </IonChip>}
                </IonCardContent>}
        </IonCard>
    )
}

export default PurchaseHeader;