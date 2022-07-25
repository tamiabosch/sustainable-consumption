import {
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
} from '@ionic/react';
import { doc, setDoc } from 'firebase/firestore';
import { saveOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { ReviewType } from '../models/ReviewType';
import { Task } from '../models/Task';
import { db } from '../service/firebaseConfig';

type groupProps = {
    week1: Task;
    week2: Task;
    week3: Task;
}


const Config: React.FC = () => {
    const [uid, setUid] = React.useState<string>('');
    const [email, setEmail] = useState<string | undefined | null>('');
    const [userGroup, setUserGroup] = useState<groupProps>();
    const [userSaved, setUserSaved] = useState<any[]>([]);

    const group = {
        g1: {
            week1: Task.CERTIFICATE,
            week2: Task.SEASONALITY,
            week3: Task.REGIONALITY,
        },
        g2: {
            week1: Task.CERTIFICATE,
            week2: Task.REGIONALITY,
            week3: Task.SEASONALITY,
        },
        g3: {
            week1: Task.SEASONALITY,
            week2: Task.CERTIFICATE,
            week3: Task.REGIONALITY,
        },
        g4: {
            week1: Task.SEASONALITY,
            week2: Task.REGIONALITY,
            week3: Task.CERTIFICATE,
        },
        g5: {
            week1: Task.REGIONALITY,
            week2: Task.CERTIFICATE,
            week3: Task.SEASONALITY,
        },
        g6: {
            week1: Task.REGIONALITY,
            week2: Task.SEASONALITY,
            week3: Task.CERTIFICATE,
        },
    }

    useEffect(() => {
        const selectedGroup = () => {
            if (email) {
                if (email.includes('g1')) {
                    console.log('g1')
                    return setUserGroup(group.g1);
                } else if (email.includes('g2')) {
                    console.log('g2')
                    return setUserGroup(group.g2);
                } else if (email.includes('g3')) {
                    console.log('g3')
                    return setUserGroup(group.g3);
                } else if (email.includes('g4')) {
                    console.log('g4')
                    return setUserGroup(group.g4);
                } else if (email.includes('g5')) {
                    console.log('g5')
                    return setUserGroup(group.g5);
                } else if (email.includes('g6')) {
                    console.log('g6')
                    return setUserGroup(group.g6);
                }
            }
        };
        selectedGroup()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email])

    const configPeerReview = {
        completed: false,
        lastLogin: new Date(), //TESTEN
        peerReviewsWritten: 0,
        reviewType: ReviewType.SelfReview,
        //reviewType: ReviewType.PeerReview,
        startDate: new Date(2022, 6, 25),
    }
    const saveUser = () => {
        if (uid && email && userGroup) {
            const userDoc = doc(db, 'users', uid);
            const aliasArray = email.split('@', 1) as [string];
            const alias = aliasArray[0];

            const createUserEntry = async () => {
                await setDoc(userDoc, { ...configPeerReview, email: email, task: userGroup, alias: alias, })
            }
            createUserEntry();
            console.log('----user saved----')
            console.log(uid)
            console.log(email)
            console.log(userGroup)
            setUserSaved([...userSaved, email])
            console.log(userSaved)

        } else {
            alert('Please fill out all fields')
        }
    }

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonLabel position="stacked">UID</IonLabel>
                    <IonInput value={uid} onIonChange={(event) => setUid(event.detail.value ? event.detail.value : '0')} placeholder="UID" />
                    <IonLabel position="stacked">Mail</IonLabel>
                    <IonInput value={email} onIonChange={(event) => setEmail(event.detail.value as string)} placeholder="Mail" />
                </IonItem>
                <IonButton className='uppercase' onClick={() => saveUser()} expand="block">
                    <IonIcon slot="start" icon={saveOutline} /> User anlegen
                </IonButton>
            </IonContent>
        </IonPage>
    );
};


export default Config;
