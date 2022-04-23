import { IonButton, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import { logout } from "../service/auth";

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonTitle size="large">{props.title}</IonTitle>
                <IonButton slot="end" fill="clear" onClick={logout}>
                    <IonIcon slot="icon-only" icon={logOutOutline} />
                </IonButton>
            </IonToolbar>
        </IonHeader>
    );
}

export default Header;