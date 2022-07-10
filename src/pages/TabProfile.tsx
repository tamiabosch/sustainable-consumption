import { IonCard, IonCardContent, IonCardSubtitle, IonContent, IonIcon, IonItem, IonLabel, IonList, IonPage, IonText } from '@ionic/react';
import { User } from '../models/User';
import { doc, getDoc } from 'firebase/firestore';
import { personOutline } from 'ionicons/icons';
import { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../service/authFirebase';
import { auth, db } from '../service/firebaseConfig';
import { ReviewType } from '../models/ReviewType';

const TabProfile: React.FC = () => {
    const { userId, email } = useAuth()
    const user = auth.currentUser;
    const [userData, setUserData] = useState<User>();
    console.log(user);

    useEffect(() => {
        const userRef = doc(db, "users", userId ? userId : '0');
        const getUserProfile = async () => {
            const userDoc = await getDoc(userRef);
            setUserData(userDoc.data() as User);
        }
        getUserProfile();
    }, [userId])

    return (
        <IonPage>
            <Header title="Profil" showLogout={true} />
            <IonContent fullscreen>
                <IonCard>
                    <IonItem >
                        <IonIcon icon={personOutline} slot="start" />
                        <IonLabel>Profildaten </IonLabel>
                    </IonItem>
                    <IonCardContent>
                        <IonList>
                            <IonItem>
                                <IonLabel>Id:</IonLabel>
                                <IonText>{userId}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Mail: </IonLabel>
                                <IonText>{email}</IonText>
                            </IonItem>
                            {userData?.reviewType === ReviewType.PeerReview &&
                                <IonItem>
                                    <IonLabel>Feedback gegeben: </IonLabel>
                                    <IonText>{userData?.reviewsWritten}</IonText>
                                </IonItem>
                            }
                        </IonList>
                        <IonCardSubtitle className='my-4' >Welche Nachhaltigkeitsthemen stehen bevor? </IonCardSubtitle>
                        {userData?.week.map((topic, index) => {
                            return (
                                <IonItem key={index}>
                                    <IonLabel>Woche {index + 1}:</IonLabel>
                                    <IonText>{topic}</IonText>
                                </IonItem>)
                        })}
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default TabProfile;
