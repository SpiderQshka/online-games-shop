import { Header } from "components/Header";
import React, { useEffect, useState } from "react";
import { Switch, Route, Link, Redirect, useHistory } from "react-router-dom";
import styles from "./styles.module.scss";
import { FaStar, FaShoppingCart, FaGamepad } from "react-icons/fa";
import { RiAdminLine, RiLogoutBoxRLine } from "react-icons/ri";
import { Achievements } from "./Achievements";
import { Orders } from "./Orders";
import {
  IApiError,
  IUser,
  IAchievementFromApi,
  IMyGameFromApi,
} from "interfaces/api";
import { useApi } from "context/api";
import { IOrderWithUserId } from "interfaces/app";
import { useAuth } from "context/auth";
import { formatOrdersForUI, removeCartData } from "utils/helpers";
import { usePopup } from "context/popup";
import { Games } from "./Games";

interface IProfileProps {}

export const Profile: React.FunctionComponent<IProfileProps> = () => {
  const history = useHistory();
  const [error, setError] = useState<IApiError | null>(null);
  const [orders, setOrders] = useState<IOrderWithUserId[]>([]);
  const [userGames, setUserGames] = useState<IMyGameFromApi[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [achievements, setAchievements] = useState<IAchievementFromApi[]>([]);
  const {
    getUserOrders,
    getUserOrderedGames,
    getUserAchievements,
    getUser,
    getDiscounts,
    getUsedDiscounts,
    getUserGames,
  } = useApi();
  const { removeToken } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const processAsync = async () => {
      const { orders, error: ordersError } = await getUserOrders();
      if (ordersError) setError(ordersError);

      const {
        orderedGames,
        error: orderedGamesError,
      } = await getUserOrderedGames();
      if (orderedGamesError) setError(orderedGamesError);

      const { user, error: userError } = await getUser();
      if (userError) setError(userError);

      const { discounts, error: discountsError } = await getDiscounts();
      if (discountsError) setError(discountsError);

      const { games: userGames, error: userGamesError } = await getUserGames();
      if (userGamesError) setError(userGamesError);

      const {
        usedDiscounts,
        error: usedDiscountsError,
      } = await getUsedDiscounts();
      if (usedDiscountsError) setError(usedDiscountsError);

      const ordersForUI = formatOrdersForUI({
        discounts,
        usedDiscounts,
        orderedGames,
        orders,
        userGames,
      });

      const { achievements, error } = await getUserAchievements();
      if (error) setError(error);
      console.log(error);

      setUser(user);
      setUserGames(userGames);
      setOrders(ordersForUI);

      setAchievements(achievements);
      setIsLoading(false);
    };
    processAsync();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.profileContainer}>
        <div className={styles.profileContent}>
          <ul className={styles.menuList}>
            <li className={`${styles.menuItem} ${styles.active}`}>
              <Link to="/profile/orders" className={styles.menuLink}>
                <FaShoppingCart color="#f4f4f4" className={styles.icon} />
                <span className={styles.menuText}>Orders</span>
              </Link>
            </li>
            <li className={`${styles.menuItem} ${styles.active}`}>
              <Link to="/profile/achievements" className={styles.menuLink}>
                <FaStar color="#f4f4f4" className={styles.icon} />
                <span className={styles.menuText}>Achievements</span>
              </Link>
            </li>
            <li className={`${styles.menuItem} ${styles.active}`}>
              <Link to="/profile/games" className={styles.menuLink}>
                <FaGamepad color="#f4f4f4" className={styles.icon} />
                <span className={styles.menuText}>My games</span>
              </Link>
            </li>
            {user && user.isAdmin && (
              <li className={`${styles.menuItem} ${styles.active}`}>
                <Link className={styles.menuLink} to="/admin">
                  <RiAdminLine color="#f4f4f4" className={styles.icon} />
                  <span className={styles.menuText}>Go to admin panel</span>
                </Link>
              </li>
            )}
            {user && (
              <li className={`${styles.menuItem} ${styles.active}`}>
                <p
                  className={styles.menuLink}
                  onClick={() => {
                    removeToken();
                    removeCartData();
                    history.push("/");
                  }}
                >
                  <RiLogoutBoxRLine color="#f4f4f4" className={styles.icon} />
                  <span className={styles.menuText}>Log out</span>
                </p>
              </li>
            )}
          </ul>
          {error ? (
            <div className={styles.errorContainer}>
              <h1 className={styles.errorHeader}>Oops!</h1>
              <h2 className={styles.errorStatus}>
                Error code - {error.status}
              </h2>
              <p className={styles.errorMsg}>{error.msg}</p>
              <p className={styles.errorAdvise}>
                Check your internet connection and try to reload this page
              </p>
            </div>
          ) : (
            <div className={`${styles.dataContainer}`}>
              <Switch>
                <Route
                  path="/profile/orders"
                  component={() => (
                    <Orders orders={orders} isLoading={isLoading} />
                  )}
                />
                <Route
                  path="/profile/achievements"
                  component={() => (
                    <Achievements
                      achievements={achievements}
                      isLoading={isLoading}
                    />
                  )}
                />
                <Route
                  path="/profile/games"
                  component={() => (
                    <Games games={userGames} isLoading={isLoading} />
                  )}
                />
                <Route component={() => <Redirect to="/profile/orders" />} />
              </Switch>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
