import { IonApp, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { cart, information, informationCircle, people, person, personOutline } from "ionicons/icons";
import { Route, Redirect } from "react-router";
import Tab1 from '../pages/Tab1';
import Tab2 from '../pages/Tab2';
import Tab3 from '../pages/Tab3';
import TabProfile from "../pages/TabProfile";
import AddPurchase from '../pages/AddPurchase';
import AddReview from '../pages/AddReview';
import Purchase from '../pages/Purchase';
import { useAuth } from './../service/authFirebase';
import AddExperienceSampling from "../pages/AddExperienceSample";

export const SingleReview = () => {
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


export const PeerReview = () => {
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
        <Route exact path="/user/tab1/add/purchase">
          <AddPurchase />
        </Route>
        <Route exact path="/user/tab1/add/review">
          <AddReview />
        </Route>
        <Route exact path="/user/tab1/add/experienceSampling">
          <AddExperienceSampling />
        </Route>
        <Route exact path="/user/tab1/view/:id">
          <Purchase />
        </Route>
        <Route exact path="/user/tab2">
          <Tab2 />
        </Route>
        <Route exact path="/user/tab2/view/:id">
          <Purchase />
        </Route>
        <Route exact path="/user/tab2/add/review">
          <AddReview />
        </Route>
        <Route exact path="/user/tab2/add/experienceSampling">
          <AddExperienceSampling />
        </Route>
        <Route path="/user/tab3">
          <Tab3 />
        </Route>
        <Route path="/user/profile">
          <TabProfile />
        </Route>
        {/* Fallback */}
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
          <IonIcon icon={informationCircle} />
          <IonLabel>Aufgabe</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/user/profile">
          <IonIcon icon={person} />
          <IonLabel>Profil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};