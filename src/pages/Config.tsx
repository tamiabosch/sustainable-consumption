import {
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
} from '@ionic/react';
import { format, parseISO } from 'date-fns';
import { collection, doc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore';
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
        //reviewType: ReviewType.SelfReview,
        reviewType: ReviewType.PeerReview,
        startDate: new Date(2022, 8, 5),
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
    const [peerReviewers, setPeerReviewers] = useState<any[]>();
    //AUSFÜLLEN
    // Zertifizierung, Saisonalität, Regionalität
    //Woche 1 25.7. - 31.7.
    //Woche 2 1.8. - 7.8.
    //Woche 3 8.8. - 14.8.
    const currentTask = Task.REGIONALITY;
    const currentWeek = 'task.week3'

    useEffect(() => {
        const fetchUsers = async () => {
            const usersRef = collection(db, 'users')
            const q = query(usersRef, where('reviewType', '==', ReviewType.PeerReview), where(currentWeek, '==', currentTask), orderBy('peerReviewsWritten', 'asc'));
            const userDocs = await getDocs(q);
            setPeerReviewers(userDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        fetchUsers()
        console.log(peerReviewers)
    }, [])

    const [openPurchases, setOpenPurchases] = useState<any[]>();
    const [sorted, setSorted] = useState<any[]>();
    useEffect(() => {
        const fetchOpenPurchases = async () => {
            const purchaseRef = collection(db, 'purchases')
            const q = query(purchaseRef, where('peerReviewer', '!=', ''), where('peerReviewed', '==', false), where('task', '==', currentTask));
            const purchaseDocs = await getDocs(q);
            const data = purchaseDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setOpenPurchases(data)
        }
        fetchOpenPurchases()
        console.log(openPurchases)
    }, [currentTask])

    // useEffect(() => {
    //     if (openPurchases) {
    //         const sortedAsc = openPurchases?.sort(
    //             (objA, objB) => {
    //                 console.log(JSON.stringify(objA.date))
    //                 return Number(objA.date) as any - Number(objB.date) as any
    //             }
    //         );

    //         // 👇️ {id: 3, date: Thu Feb 24 2022,
    //         //     id: 2, date: Fri Feb 24 2023
    //         //     id: 5, date: Wed Feb 24 2027}
    //         console.log(sortedAsc);
    //         setSorted(sortedAsc)
    //         console.log('Sorted:' + sorted)
    //     }
    // }, [openPurchases])



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
                {/* sort peerReviewers */}
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-col'>
                        <h2 className='text-lg font-medium mt-5 '>{currentWeek}:  {currentTask}</h2>
                        <p></p>
                        {peerReviewers?.map((peerReviewer) => (
                            <div key={peerReviewer.id} className="my-4">
                                <p>{peerReviewer.id}</p>
                                <p>{peerReviewer.alias} </p>
                                <p>Peer Reviews Written: {peerReviewer.peerReviewsWritten}</p>
                            </div>
                        ))}
                    </div>
                    {/* Map all openPurchases */}
                    <div className='flex flex-col'>
                        <h2 className='mt-5 text-lg font-medium'>Open Purchases {openPurchases?.length}</h2>
                        {openPurchases?.map((openPurchase) => (
                            <div key={openPurchase.id} className="my-4">
                                <p><b>{openPurchase.title}: {format(parseISO(openPurchase.date), 'd MMM, yyyy')}</b> </p>
                                <p><b>PurchaseId:</b> {openPurchase.id}</p>
                                <p><b>Owner:</b> {openPurchase.owner}</p>
                                <p><b>PeerReviewer:</b> {openPurchase.peerReviewer}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
};


export default Config;
