import React, { lazy, Suspense, useCallback, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { AuthContext } from "./context/auth";
import "./styles/reset.scss";
import { PrivateRoute } from "components/PrivateRoute";
import { ApiContext } from "context/api";
import { PopupContext } from "context/popup";
import { API } from "utils/api";
import { IconContext } from "react-icons";
import { PageLoader } from "components/Loader";
import {
  getTokenFromLocalStorage,
  setTokenToLocalStorage,
  removeTokenFromLocalStorage,
} from "utils/helpers";
import { PopupType } from "context/popup";
import { Popup } from "components/Popup";
import { YMaps } from "react-yandex-maps";
import { AdminRoute } from "components/AdminRoute";
import { config } from "dotenv";
const FAQ = lazy(() => import("pages/FAQ"));
const Contacts = lazy(() => import("pages/Contacts"));
const SuccessPage = lazy(() => import("pages/Store/SuccessPage"));
const SignUp = lazy(() => import("pages/SignUp"));
const Profile = lazy(() => import("pages/Profile"));
const NotFound = lazy(() => import("pages/NotFound"));
const Store = lazy(() => import("pages/Store"));
const Login = lazy(() => import("pages/Login"));
const GameItem = lazy(() => import("pages/GameItem"));
const Cart = lazy(() => import("pages/Cart"));
const Admin = lazy(() => import("pages/Admin"));

config();

function App() {
  const [token, setTokenToContext] = useState<string | null>(
    getTokenFromLocalStorage()
  );

  const setTokenHandler = (token: string) => {
    setTokenToLocalStorage(token);
    setTokenToContext(token);
  };

  const removeTokenHandler = () => {
    removeTokenFromLocalStorage();
    setTokenToContext(null);
  };

  const [popupType, setPopupType] = useState<PopupType>("error");
  const [popupMsg, setPopupMsg] = useState<string>("Message");
  const [popupStatus, setPopupStatus] = useState<number>(0);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const showPopup = useCallback(
    (config: { type: PopupType; msg: string; code?: number }) => {
      setPopupType(config.type);
      setPopupMsg(config.msg);
      if (config.code) setPopupStatus(config.code);
      setIsPopupOpen(true);
    },
    []
  );
  const hidePopup = useCallback(() => setIsPopupOpen(false), []);

  console.log(process.env);

  return (
    <IconContext.Provider value={{ color: "#f4f4f4" }}>
      <AuthContext.Provider
        value={{
          token,
          setToken: setTokenHandler,
          removeToken: removeTokenHandler,
        }}
      >
        <ApiContext.Provider value={API}>
          <PopupContext.Provider
            value={{
              isOpen: isPopupOpen,
              msg: popupMsg,
              type: popupType,
              status: popupStatus,
              showPopup,
              hidePopup,
            }}
          >
            <YMaps>
              <Router>
                <Suspense fallback={<PageLoader />}>
                  <Popup />
                  <Switch>
                    <Route
                      exact
                      path="/"
                      component={() => <Redirect to="/store" />}
                    />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup" component={SignUp} />
                    <PrivateRoute path="/profile" component={Profile} />
                    <Route exact path="/store" component={Store} />
                    <Route exact path="/contacts" component={Contacts} />
                    <Route path="/store/item/:id" component={GameItem} />
                    <Route path="/faq" component={FAQ} />
                    <PrivateRoute exact path="/cart" component={Cart} />
                    <PrivateRoute
                      path="/cart/success"
                      component={SuccessPage}
                    />
                    <AdminRoute path="/admin" component={Admin} />
                    <Route component={NotFound} />
                  </Switch>
                </Suspense>
              </Router>
            </YMaps>
          </PopupContext.Provider>
        </ApiContext.Provider>
      </AuthContext.Provider>
    </IconContext.Provider>
  );
}

export default App;
