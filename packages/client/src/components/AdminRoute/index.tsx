import { PageLoader } from "components/Loader";
import { useApi } from "context/api";
import React, { useEffect, useState } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "../../context/auth";

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

export const AdminRoute: React.FunctionComponent<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { token } = useAuth();
  const { getUser } = useApi();
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const processAsync = async () => {
      setIsLoading(true);
      const { user } = await getUser();
      if (user) setIsUserAdmin(user.isAdmin);
      setIsLoading(false);
    };
    processAsync();
  }, [token]);
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoading ? (
          <PageLoader />
        ) : isUserAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};
