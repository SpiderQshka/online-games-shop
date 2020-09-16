import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "pages/Login";
import { SignUp } from "pages/SignUp";
import { AuthContext } from "./context/auth";
import "./styles/reset.scss";
import { PrivateRoute } from "components/PrivateRoute";
import { Profile } from "pages/Profile";
import { ApiContext } from "context/api";
import { API } from "utils/api";
import { Store } from "pages/Store";
import { IconContext } from "react-icons";

function App() {
  const [token, setAuthToken] = useState(window.localStorage.getItem("token"));

  const setToken = (token: string) => {
    localStorage.setItem("token", token);
    setAuthToken(token);
  };
  return (
    <IconContext.Provider value={{ color: "#f4f4f4" }}>
      <AuthContext.Provider value={{ setToken, token }}>
        <ApiContext.Provider value={{ ...API }}>
          <Router>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
              <PrivateRoute path="/profile" component={Profile} />
              <Route path="/store" component={Store} />
            </Switch>
          </Router>
        </ApiContext.Provider>
      </AuthContext.Provider>
    </IconContext.Provider>
  );
}

export default App;
