import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/react';
import { trashOutline, compass, ribbon } from 'ionicons/icons';
import { Item } from '../models/Item';

interface PurchaseItemProps {
    item: Item;
    onDelete?: (item: Item) => void;
    editable?: boolean;
}
// add options, disable delete, add review
const PurchaseItem: React.FC<PurchaseItemProps> = ({ item, ...props }) => {
    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle className='text-lg' >{item.title}
                    { props.editable && <IonIcon icon={trashOutline} className="float-right" onClick={() => props.onDelete?.(item)} /> }
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonIcon slot="icon-only" icon={compass} className='mr-2' />
                Herkunft: {item.origin} <br />
                <IonIcon slot="icon-only" icon={ribbon} className='mr-2' />
                Zertifikat: {item.certificate} <br />
            </IonCardContent>
        </IonCard>
    );
};

export default PurchaseItem;