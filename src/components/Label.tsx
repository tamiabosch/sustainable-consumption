import {IonButton, IonIcon} from "@ionic/react";
import { enterOutline } from 'ionicons/icons';

interface LabelProps {  
    text: string;
    link: string;
    icon?: string;
}

const Label: React.FC<LabelProps> = (props) => {
    return (
        <IonButton fill="outline" slot="start" href={props.link}>

        {/* <IonIcon slot="start" icon={checkmark} /> */}
          {/* {props.icon && <IonIcon slot="start" icon={props.icon} />} */}
          {props.children}
          {props.text}
        </IonButton>
    );
}
export default  Label;

