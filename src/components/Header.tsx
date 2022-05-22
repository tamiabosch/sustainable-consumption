import { IonButton, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import { useAuth } from "../service/auth";

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
    const { logoutUser, loggedIn } = useAuth();
    function logoutSubmit(event: any) {
        event.preventDefault();
        logoutUser();
        console.log('logout: loggedIn?' + loggedIn)
      }
    return (
        <IonHeader>
            <IonToolbar>
                <IonTitle size="large">{props.title}</IonTitle>
                <IonButton slot="end" fill="clear" onClick={logoutSubmit}>
                    <IonIcon slot="icon-only" icon={logOutOutline} />
                </IonButton>
            </IonToolbar>
        </IonHeader>
    );
}

export default Header;