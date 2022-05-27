import {
  IonApp,
  IonIcon,
  IonLabel,
  IonLoading,
  IonPage,
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
import LoginView from './routes/LoginRoute';
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
import { Redirect, Route, RouteComponentProps } from 'react-router';
import React from 'react';

/* Custom Stuff */
import { AuthProvider, useAuth } from './service/auth';
import { auth } from "./service/firebaseConfig";


setupIonicReact();
const PeerReview = () => {
  console.log("PeerReview called");
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

const AuthView: React.FC<RouteComponentProps> = ({history}) => {
  return (
      <IonTabs>
        <IonRouterOutlet>
          <Route
            exact
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
          <Redirect from="/" to="/tab1" />

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
          <IonTabButton tab="tab3" href="/tab3" onClick={e => {
              e.preventDefault();
              history.push('/tab3')
            }}>
            <IonIcon icon={information} />
            <IonLabel>Aufgabe</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
  );
}

const App: React.FC = () => {
  const [firebaseLoggedIn, setFirebaseLoggedIn] = useState(false);
  const { loggedIn, token } = useAuth()

  useEffect( () => {
    auth.onAuthStateChanged(function (user) {
    console.log("set firebase"+ user);
    if (user) {
      // User is signed in.
      setFirebaseLoggedIn(true);
    } else {
      setFirebaseLoggedIn(false);
    }
  })}, [loggedIn, token]);

  console.log("App FB logged in: " + firebaseLoggedIn);
  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            {/* {(firebaseLoggedIn) ? (
            //   <>
            //   <Route exact path="/tab1" render={props => <AuthView {...props} />} />
            //   <Route path="/" render={() => <Redirect to="/tab1" />} />
            //   <Route exact path="/login" render={() => <Redirect to="/tab1" />} />
            //   </>
            // )
            //   : (
            //       <>
            //         <Route exact path="/login" component={Login} /><Redirect from="/" to="/login" />
            //       </>
            //   )} */}
            <Route path="/login" component={Login} exact={true} />
            {/* <Route path="/tab1" component={Tab1} /> */}
            {/* <Route exact path="/" component={firebaseLoggedIn ? Tab1 : Login} /> */}
            <PeerReview />
            {/* <Route exact path="/tab1" render={props => <AuthView {...props}/>}/> */}
            {/* <Redirect from="/" to={firebaseLoggedIn ? '/tab1' : '/login'} /> */}
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
      {/* <Route
        exact
        path="/"
        render={(props) => {
          return (firebaseLoggedIn || loggedIn) ? <DashboardPage /> : <Login />;
        }}
      /> */}
    </AuthProvider>
  )
}

export default App;
