import { IonBackButton, IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/react";
import { signOut } from "firebase/auth";
import { logOutOutline } from "ionicons/icons";
import { auth } from "../service/firebaseConfig";


interface HeaderProps {
  title: string;
  showLogout?: boolean
  slotRight?: React.ReactNode | string;
  showBackBtn?: boolean;
}

const Header: React.FC<HeaderProps> = (props) => {
  function logoutSubmit(event: any) {
    event.preventDefault();
    signOut(auth)
  }
  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>{props.title}</IonTitle>
        {props.slotRight &&
          <IonButtons slot="end">
            {props.slotRight}
          </IonButtons>}
        {props.showBackBtn &&
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>}
        {props.showLogout &&
          <IonButton slot="end" fill="clear" onClick={logoutSubmit}>
            <IonIcon slot="icon-only" icon={logOutOutline} />
          </IonButton>}

      </IonToolbar>
    </IonHeader>
  );
}

export default Header;