import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "../../context/auth";

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

export const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { token } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        token ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};
