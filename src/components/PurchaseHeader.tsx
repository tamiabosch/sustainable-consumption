import { IonCard, IonCardHeader, IonIcon, IonLabel, IonCardTitle, IonCardSubtitle, IonCardContent, IonChip } from "@ionic/react";
import { format, parseISO } from "date-fns";
import { cartOutline, checkmark, contractOutline, contrastOutline, mapOutline, pricetagsOutline, warningOutline } from "ionicons/icons";
import { useState } from "react";
import { useHistory } from 'react-router';
import { Purchase } from "../models/Purchase";
import { ReviewType } from "../models/ReviewType";
import { Task } from "../models/Task";
import '../pages/Likert.css'

const PurchaseHeader: React.FC<Purchase> = ({ id, title, date, task, description, link, overview, peerReviewed, reviewed, peerReviewer }) => {
    const history = useHistory();
    const hrefFeedback = '/user/tab2/view/'
    const hrefSelf = '/user/tab1/view/'
    const currentLocation = window.location.href;

    const handleFeedbackClick = (reviewType: ReviewType) => {
        if (currentLocation.includes(hrefFeedback) && reviewType === ReviewType.SelfReview) {
            return true
        } else if (currentLocation.includes(hrefSelf) && reviewType === ReviewType.PeerReview) {
            return true
        } else {
            const path = reviewType === ReviewType.PeerReview ? '/user/tab2/add/review' : '/user/tab1/add/review';
            const location = {
                pathname: path,
                state: { purchaseId: id, reviewType: reviewType }
            }
            history.replace(location)
        }

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
        taskFinished: "Feedback angefordert", //naming macht keinen sinn, ist eigentlich wenn der task noch offen ist
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
                        <IonCardSubtitle className="flex items-center">
                            {{
                                [Task.CERTIFICATE]: <IonIcon icon={pricetagsOutline} className='mr-2' />,
                                [Task.REGIONALITY]: <IonIcon icon={mapOutline} className='mr-2' />,
                                [Task.SEASONALITY]: <IonIcon icon={contrastOutline} className='mr-2' />
                            }[task]}

                            {task}</IonCardSubtitle>
                    </IonLabel>
                    <IonIcon icon={cartOutline} slot="start" className="w-8 h-8" />
                </div>
            </IonCardHeader>
            {description && <IonCardContent>{description}</IonCardContent>}
            {overview &&
                <IonCardContent>
                    <LabelStatus {...reviewProps} taskFinished={currentLocation.includes('/user/tab1') ? "Einkauf bewerten" : "Bewertung offen"} />
                    {peerReviewer && //falls nicht, wird es den Single Review Leuten gar nicht erstn angezeigt
                        <LabelStatus {...peerReviewProps} taskFinished={currentLocation.includes('/user/tab2') ? "Feedback geben" : "Feedback angefordert"} />
                    }
                    <p>{peerReviewer}</p>
                </IonCardContent>
            }
        </IonCard>
    )
}

export default PurchaseHeader;