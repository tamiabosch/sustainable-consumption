import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router";
import Login from "../pages/Login";
import AuthProvider from "../service/auth";

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

export default LoginView;