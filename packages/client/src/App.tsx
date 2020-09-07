import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "pages/Login";
import { SignUp } from "pages/SignUp";
import "./styles/reset.scss";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
