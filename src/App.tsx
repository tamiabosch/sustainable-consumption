import {
  IonApp,
  IonIcon,
  IonLabel,
  IonLoading,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';

import { cart, people, information } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Login from './pages/Login';
import Authenticated from './routes/Authenticated';

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
import { useEffect, useState } from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import React from 'react';

/* Custom Stuff */
import { AuthProvider, useAuth } from './service/auth';
import { auth } from "./service/firebaseConfig";
import { userInfo } from 'os';



setupIonicReact();
const PeerReview = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/tab1">
              <Tab1 />
            </Route>
            <Route exact path="/tab2">
              <Tab2 />
            </Route>
            <Route path="/tab3">
              <Tab3 />
            </Route>
            <Route exact path="/">
              <Redirect to="/tab1" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/tab1">
              <IonIcon icon={cart} />
              <IonLabel>Einkäufe</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon icon={people} />
              <IonLabel>Feedback</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/tab3">
              <IonIcon icon={information} />
              <IonLabel>Aufgabe</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};






// interface RouteProps extends RouteProps {
//   isAuth: boolean;
//   component: any;
//   path: string;
// }
// const Route: React.FC<RouteProps> = (
//   props: RouteProps
// ) => {
//   return props.isAuth ? (
//       <Route {...props} component={props.component} path={props.path} />
//   ) : (
//       <Redirect to={"/login"} />
//   );
// };

const AuthView = () => {
  return (
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route
                path="/tab1"
                component={Tab1}
              />
              <Route
                path="/tab2"
                component={Tab2}
              />
              <Route
                path="/tab3"
                component={Tab3}
              />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="tab1" href="/tab1">
                <IonIcon icon={cart} />
                <IonLabel>Einkäufe</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/tab2">
                <IonIcon icon={people} />
                <IonLabel>Feedback</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab3" href="/tab3">
                <IonIcon icon={information} />
                <IonLabel>Aufgabe</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>

  );
}

const LoginView = () => {
  console.log("LoginView");
  return (
  <Route exact path="/login" component={Login} />

  );
};

const App: React.FC = () => {
  const { loading, loggedIn } = useAuth();
  const [firebaseLoggedIn, setFirebaseLoggedIn] = useState(false);
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      setFirebaseLoggedIn(true);
    } else {
      setFirebaseLoggedIn(false);
    }
  });
  console.log("App FB logged in: " + firebaseLoggedIn);
  console.log("App loading: " + loading);
  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <Route
            path="/"
            render={(props) => {
              return loggedIn ? <p>hi</p> : <Login />
            }} />
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  )
}

export default App;
