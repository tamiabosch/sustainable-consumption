import {
  IonApp,
  IonLoading,
  setupIonicReact
} from '@ionic/react';


import Login from './pages/Login';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Routing */
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router';
import React, { useEffect, useState } from 'react';

/* Custom Stuff */
// import { AuthProvider } from './service/auth';
import { AuthContext, useAuthInit } from './service/authFirebase';
import NotFoundPage from './pages/NotFoundPage';
import { PeerReview, SelfReview } from './routes/LoggedInRoutes'
import { User } from "./models/User";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './service/firebaseConfig';
import { ReviewType } from './models/ReviewType';
import Notifications from './service/Notifications';
import Config from './pages/Config';


setupIonicReact();

const App: React.FC = () => {
  const { loading, auth } = useAuthInit();
  console.log('auth:', auth);
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    if (auth?.userId) {
      const userRef = doc(db, "users", auth.userId);
      const getUserProfile = async () => {
        const userDoc = await getDoc(userRef);
        setUserData(userDoc.data() as User);
      }
      getUserProfile();
      //set LastLogin on Server
    }
  }, [auth])

  useEffect(() => {
    //only set lastLogin if it's on a new day, to minimize db updates
    //userData?.lastLogin.toDate().getDate() !== new Date().getDate()
    if (auth !== undefined) {
      const userDoc = doc(db, 'users', "" + auth?.userId);
      updateDoc(userDoc, { lastLogin: new Date() })
      console.log('last:', userData?.lastLogin);
    }
  }, [auth])

  useEffect(() => {
    if (userData?.startDate !== undefined) {
      //schedule according to start date, and shoe extra notification for peer feedback reminder
      Notifications.schedule(userData?.startDate.toDate(), userData?.reviewType === ReviewType.PeerReview ? true : false);
    }
  }, [userData])


  if (loading) {
    return <IonLoading isOpen />;
  }
  console.log(`rendering App with auth:`, auth);
  return (
    <IonApp>
      <AuthContext.Provider value={auth ? auth : { loggedIn: false }}>
        <IonReactRouter>
          <Switch>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/config">
              <Config />
            </Route>
            <Route path="/user">
              {userData?.reviewType === ReviewType.PeerReview ? <PeerReview /> : <SelfReview />}
            </Route>
            <Redirect exact path="/" to="/user/tab1" />
            <Route path="/" >
              <NotFoundPage />
              {userData?.reviewType === ReviewType.PeerReview ? <PeerReview /> : <SelfReview />}
            </Route>
          </Switch>
        </IonReactRouter>
      </AuthContext.Provider>
    </IonApp>
  )
}

export default App;


