import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import Login from "../pages/Login";

const LoginView = () => {
    console.log("LoginView");
    return (

          <IonReactRouter>
            <IonRouterOutlet>
              <Route exact path="/login" component={Login} />
              <Redirect from="/" to="/login" />
            </IonRouterOutlet>
          </IonReactRouter>
    );
  };

export default LoginView;