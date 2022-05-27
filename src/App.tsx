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
import { Redirect, Route, Switch } from 'react-router';
import React from 'react';

/* Custom Stuff */
// import { AuthProvider } from './service/auth';
import { AuthContext, useAuthInit, useAuth } from './service/authFirebase';
import NotFoundPage from './pages/NotFoundPage';
import AuthProvider from './service/auth';



setupIonicReact();
const PeerReview = () => {
  console.log("PeerReview called");
  const { loggedIn } = useAuth();
  if (!loggedIn) {
    return <Redirect to="/login" />;
  }
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/user/tab1">
          <Tab1 />
        </Route>
        <Route exact path="/user/tab2">
          <Tab2 />
        </Route>
        <Route path="/user/tab3">
          <Tab3 />
        </Route>
        <Route exact path="/user">
          <Redirect to="/user/tab1" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/user/tab1">
          <IonIcon icon={cart} />
          <IonLabel>Einkäufe</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/user/tab2">
          <IonIcon icon={people} />
          <IonLabel>Feedback</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/user/tab3">
          <IonIcon icon={information} />
          <IonLabel>Aufgabe</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
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

const App: React.FC = () => {
  const { loading, auth } = useAuthInit();
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
            <Route path="/user">
              <PeerReview />
            </Route>
            <Redirect exact path="/" to="/user/tab1" />
            <Route path="/" >
              <NotFoundPage />
              <PeerReview />
            </Route>
            </Switch>
        </IonReactRouter>
      </AuthContext.Provider>
    </IonApp>
  )
}

export default App;


