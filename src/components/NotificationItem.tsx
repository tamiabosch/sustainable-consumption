import { IonItem, IonIcon, IonLabel } from "@ionic/react";
import { chatbox, pencilOutline } from 'ionicons/icons';

interface NotificationItemProps {
    details: string;
    link: string;
    reviewType: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ details, link, reviewType }) => {
    //Review of own Purchase
    const Review = () => {
        return (
            <IonItem href={link}>
                <IonIcon icon={pencilOutline} slot="start" />
                <IonLabel>
                    <h2>Bewerte deinen Einkauf</h2>
                    <p>{details}</p>
                </IonLabel>
            </IonItem>
        );
    }
    //Received a Peer Review of own Purchase
    const PeerReview = () => {
        return (
            <IonItem href={link}>
                <IonIcon icon={chatbox} slot="start" />
                <IonLabel>
                    <h2>Gib dein Feedback</h2>
                    <p>zum Einkauf {details}</p>
                </IonLabel>
            </IonItem>
        );
    }
    //Give a Peer Review to a Purchase
    const GivePeerReview = () => {
        return (
            <IonItem href={link}>
                <IonIcon icon={chatbox} slot="start" />
                <IonLabel>
                    <h2>New Peer Review</h2>
                    <p>{details}</p>
                </IonLabel>
            </IonItem>
        );
    }

    //define return type of Notification
    if (reviewType === 'review') {
        return <Review />;
    } else if (reviewType === 'peerReview') {
        return <PeerReview />;
    } else if (reviewType === 'givePeerReview') {
        return <GivePeerReview />;
    } else {
        return <Review />;
    };
};
export default NotificationItem;
