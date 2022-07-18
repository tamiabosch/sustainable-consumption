import { IonCard, IonCardContent, IonCardSubtitle, IonContent, IonIcon, IonItem, IonLabel, IonList, IonPage, IonText } from '@ionic/react';
import { User } from '../models/User';
import { doc, getDoc } from 'firebase/firestore';
import { contrastOutline, helpCircleOutline, mapOutline, personOutline, pricetagsOutline, readerOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../service/authFirebase';
import { db } from '../service/firebaseConfig';
import { ReviewType } from '../models/ReviewType';
import { Task } from '../models/Task';

const TabProfile: React.FC = () => {
    const { userId, email } = useAuth()
    const [userData, setUserData] = useState<User>();

    useEffect(() => {
        const userRef = doc(db, "users", userId ? userId : '0');
        const getUserProfile = async () => {
            const userDoc = await getDoc(userRef);
            setUserData(userDoc.data() as User);
        }
        getUserProfile();
    }, [userId])
    console.log(userData?.startDate)

    return (
        <IonPage>
            <Header title="Profil" showLogout={true} />
            <IonContent fullscreen>
                <IonCard>
                    <IonItem className='mt-2'>
                        <IonIcon icon={personOutline} slot="start" />
                        <IonLabel className='text-xl font-extrabold'>Profil Daten </IonLabel>
                    </IonItem>
                    <IonCardContent>
                        <IonList>
                            <IonItem>
                                <IonLabel>Id:</IonLabel>
                                <IonText className='text-sm'>{userId}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Mail: </IonLabel>
                                <IonText>{email}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Alias: </IonLabel>
                                <IonText>{email?.split('@', 1)}</IonText>
                            </IonItem>
                            {userData?.reviewType === ReviewType.PeerReview &&
                                <IonItem>
                                    <IonLabel>Feedback gegeben: </IonLabel>
                                    <IonText>{userData?.peerReviewsWritten}</IonText>
                                </IonItem>
                            }
                        </IonList>
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <IonItem className='mt-2'>
                        <IonIcon icon={readerOutline} slot="start" />
                        <IonLabel className='text-xl font-extrabold'>Aufgaben </IonLabel>
                    </IonItem>
                    <IonCardContent>
                        <IonCardSubtitle className='my-4' >Start Datum Studie</IonCardSubtitle>
                        <IonItem>{userData?.startDate.toDate().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</IonItem>
                        <IonCardSubtitle className='my-4' >Welche Nachhaltigkeitsthemen stehen bevor? </IonCardSubtitle>
                        {userData?.task &&
                            <>
                                <IonItem>
                                    <IonLabel>Woche 1:</IonLabel>
                                    <IonText className='flex items-center'>{userData.task.week1}
                                        {{
                                            [Task.CERTIFICATE]: <IonIcon icon={pricetagsOutline} className='ml-2' />,
                                            [Task.REGIONALITY]: <IonIcon icon={mapOutline} className='ml-2' />,
                                            [Task.SEASONALITY]: <IonIcon icon={contrastOutline} className='ml-2' />
                                        }[userData.task.week1]}
                                    </IonText>
                                </IonItem>

                                <IonItem>
                                    <IonLabel>Woche 2:</IonLabel>
                                    <IonText className='flex items-center'>{userData.task.week2}
                                        {{
                                            [Task.CERTIFICATE]: <IonIcon icon={pricetagsOutline} className='ml-2' />,
                                            [Task.REGIONALITY]: <IonIcon icon={mapOutline} className='ml-2' />,
                                            [Task.SEASONALITY]: <IonIcon icon={contrastOutline} className='ml-2' />
                                        }[userData.task.week2]}
                                    </IonText>
                                </IonItem>

                                <IonItem>
                                    <IonLabel>Woche 3:</IonLabel>
                                    <IonText className='flex items-center'>{userData.task.week3}
                                        {{
                                            [Task.CERTIFICATE]: <IonIcon icon={pricetagsOutline} className='ml-2' />,
                                            [Task.REGIONALITY]: <IonIcon icon={mapOutline} className='ml-2' />,
                                            [Task.SEASONALITY]: <IonIcon icon={contrastOutline} className='ml-2' />
                                        }[userData.task.week3]}
                                    </IonText>
                                </IonItem>
                            </>
                        }

                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <IonItem className='mt-2'>
                        <IonIcon icon={helpCircleOutline} slot="start" />
                        <IonLabel className='text-xl font-extrabold'>Hilfe </IonLabel>
                    </IonItem>
                    <IonCardContent>
                        Sollten irgendwelche Probleme oder Fragen auftreten, kannst du mich geren per Mail kontaktieren. <br />
                        <a href="mailto:t.bosch@campus.lmu.de" className='text-blue-500'>t.bosch@campus.lmu.de</a>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default TabProfile;
