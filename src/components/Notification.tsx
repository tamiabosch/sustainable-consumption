import {IonItem, IonIcon, IonLabel} from "@ionic/react";
import { warning, chatbox } from 'ionicons/icons';

interface ContainerProps {
    details: string;
    link: string;
    peerReview: boolean;
  }
  
  const Notification: React.FC<ContainerProps> = ({ details, link, peerReview}) => {
    const PeerReview = () => {
        return (
            <IonItem>
            <IonIcon icon={warning} slot="start" />
            <IonLabel>
                <h2>Open Purchase Review</h2>
                <p>{details}</p>
            </IonLabel>
            </IonItem>
        );
    }

    const Review = () => {
        return (
            <IonItem href={link} className="ion-activated">
                <IonIcon icon={chatbox} slot="start" />
                <IonLabel>
                    <h2>New Peer Review</h2>                
                    <p>{details}</p>
                </IonLabel>
            </IonItem>
        );
    }
    if (peerReview) {
        return <PeerReview />;
    }
    
    return <Review />;

  };
  
  export default Notification;
  