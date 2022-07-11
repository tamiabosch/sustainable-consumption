import { IonCard, IonCardHeader, IonItem, IonIcon, IonLabel, IonCardTitle, IonCardSubtitle, IonCardContent, IonChip } from "@ionic/react";
import { format, parseISO } from "date-fns";
import { cartOutline, checkmark, warningOutline } from "ionicons/icons";
import { useHistory } from 'react-router';
import { Purchase } from "../models/Purchase";
import { ReviewType } from "../models/ReviewType";


const PurchaseHeader: React.FC<Purchase> = ({ id, title, date, task, description, link, overview, peerReviewed, reviewed, peerReviewer }) => {
    const history = useHistory();
    console.log('purchaseID:', id)

    const handleFeedbackClick = (reviewType: ReviewType) => {
        const location = {
            pathname: '/user/tab1/add/review',
            //todo umstände irgenwie mitgeben
            state: { purchaseId: id, reviewType: reviewType }
        }
        history.replace(location)
        console.log("Feedback" + id);
    }

    const LabelStatus = ({ open, task, taskFinished, reviewType }: { open: boolean | undefined, task: string, taskFinished: string, reviewType: ReviewType }) => {
        return (
            open ? (
                <IonChip color="success">
                    <IonIcon icon={checkmark} color="dark" />
                    <IonLabel>{task}</IonLabel>
                </IonChip>
            ) : (
                <IonChip color="warning" onClick={() => handleFeedbackClick(reviewType)} >
                    <IonIcon icon={warningOutline} color="dark" />
                    <IonLabel>{taskFinished}</IonLabel>
                </IonChip>
            )
        )
    }
    console.debug('header')

    const peerReviewProps = {
        task: "Feedback empfangen",
        taskFinished: "Feedback angefordert",
        open: peerReviewed,
        reviewType: ReviewType.PeerReview
    }

    const reviewProps = {
        task: "bewertet",
        taskFinished: "Einkauf bewerten",
        open: reviewed,
        reviewType: ReviewType.SelfReview
    }
    return (
        <IonCard routerLink={link}>
            <IonCardHeader>
                <div className="flex flex-row justify-between">
                    <IonLabel>
                        <IonCardTitle>{title}</IonCardTitle>
                        <IonCardSubtitle>{format(parseISO(date), 'd MMM, yyyy')}</IonCardSubtitle>
                        <IonCardSubtitle>{task}</IonCardSubtitle>
                    </IonLabel>
                    <IonIcon icon={cartOutline} slot="start" className="w-8 h-8" />
                </div>
            </IonCardHeader>
            {description && <IonCardContent>{description}</IonCardContent>}
            {overview &&
                <IonCardContent>
                    <LabelStatus {...reviewProps} />
                    {peerReviewer && //falls nicht, wird es den Single Review Leuten gar nicht erstn angezeigt
                        <LabelStatus {...peerReviewProps} />
                    }
                </IonCardContent>
            }
        </IonCard>
    )
}

export default PurchaseHeader;