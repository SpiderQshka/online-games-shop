import React, { useState, lazy, Suspense } from "react";
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
import { API } from "utils/api";
import { IconContext } from "react-icons";
import { PageLoader } from "components/Loader";
const SignUp = lazy(() => import("pages/SignUp"));
const Profile = lazy(() => import("pages/Profile"));
const NotFound = lazy(() => import("pages/NotFound"));
const Store = lazy(() => import("pages/Store"));
const Login = lazy(() => import("pages/Login"));
const GameItem = lazy(() => import("pages/GameItem"));
const Cart = lazy(() => import("pages/Cart"));
const Admin = lazy(() => import("pages/Admin"));
function App() {
  const [token, setAuthToken] = useState<string | null>(
    window.localStorage.getItem("token")
      ? window.localStorage.getItem("token")
      : null
  );

  const setToken = (token: string) => {
    localStorage.setItem("token", token);
    setAuthToken(token);
  };
  return (
    <IconContext.Provider value={{ color: "#f4f4f4" }}>
      <AuthContext.Provider value={{ setToken, token }}>
        <ApiContext.Provider value={API}>
          <Router>
            <Suspense fallback={<PageLoader />}>
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
                <Route path="/store/item/:id" component={GameItem} />
                <PrivateRoute exact path="/cart" component={Cart} />
                <PrivateRoute path="/admin" component={Admin} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </Router>
        </ApiContext.Provider>
      </AuthContext.Provider>
    </IconContext.Provider>
  );
}

export default App;
