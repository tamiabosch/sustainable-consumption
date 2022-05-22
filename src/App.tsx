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

const SingleReview = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/tab1">
              <Tab1 />
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


const LoginView = () => {
  console.log("LoginView");
  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/login" component={Login} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
};

interface ProtectedRouteProps extends RouteProps {
  isAuth: boolean;
  component: any;
  path: string;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = (
  props: ProtectedRouteProps
) => {
  return props.isAuth ? (
      <Route {...props} component={props.component} path={props.path} />
  ) : (
      <Redirect to={"/login"} />
  );
};

const AuthView = () => {
  console.log("AuthView");
  const firebaseLoggedIn = true
  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
          <IonRouterOutlet>
            <ProtectedRoute
              path="/tab1"
              component={Tab1}
              isAuth={firebaseLoggedIn}
            />
            <ProtectedRoute
              path="/tab2"
              component={Tab2}
              isAuth={firebaseLoggedIn}
            />
            <ProtectedRoute
              path="/tab3"
              component={Tab3}
              isAuth={firebaseLoggedIn}
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
      </IonApp>
    </AuthProvider >
    );  
}

const App: React.FC = () => {
  const { loggedIn, loading } = useAuth();
  console.log("App: " + loggedIn);
  const [firebaseLoggedIn, setFirebaseLoggedIn] = useState(false);
  const [gr, setGr] = useState(true);
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      setFirebaseLoggedIn(true);
    } else {
      setFirebaseLoggedIn(false);
    }
    setGr((loads) => loads = false);
  });
  console.log("App FB: " + firebaseLoggedIn);
  console.log("loading: " + loading);
  return (!gr || undefined ) ? (
    <IonApp>
      <IonLoading message="Starting App..." isOpen={false} />
    </IonApp>
  ) : (
  <>
   {firebaseLoggedIn ? <AuthView /> : <LoginView />}
  </>
  );

}

export default App;
