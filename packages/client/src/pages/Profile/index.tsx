import { Header } from "components/Header";
import React, { useEffect, useState } from "react";
import { Switch, Route, Link, Redirect, useHistory } from "react-router-dom";
import styles from "./styles.module.scss";
import { FaStar, FaShoppingCart, FaGamepad } from "react-icons/fa";
import { RiAdminLine, RiLogoutBoxRLine } from "react-icons/ri";
import { Achievements } from "./Achievements";
import { Orders } from "./Orders";
import { IUser, IMyGameFromApi, IMyAchievementFromApi } from "interfaces/api";
import { useApi } from "context/api";
import {
  defaultErrorObj,
  IErrorObject,
  IOrderWithUserId,
} from "interfaces/app";
import { useAuth } from "context/auth";
import {
  checkNewAchievements,
  formatOrdersForUI,
  removeCartData,
} from "utils/helpers";
import { usePopup } from "context/popup";
import { Games } from "./Games";
import _ from "lodash";

interface IProfileProps {}

export const Profile: React.FunctionComponent<IProfileProps> = () => {
  const history = useHistory();
  const { showPopup } = usePopup();
  const [error, setError] = useState<IErrorObject>(defaultErrorObj);
  const [orders, setOrders] = useState<IOrderWithUserId[]>([]);
  const [userGames, setUserGames] = useState<IMyGameFromApi[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [achievements, setAchievements] = useState<IMyAchievementFromApi[]>([]);
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
    if (checkNewAchievements(achievements))
      showPopup({ msg: "Achievement get!", type: "success" });
  }, [achievements.length]);

  useEffect(() => {
    setIsLoading(true);
    const processAsync = async () => {
      const errorObj = { ...defaultErrorObj } as IErrorObject;
      const { orders, error: ordersError } = await getUserOrders();
      if (ordersError) errorObj.orders = ordersError;

      const {
        orderedGames,
        error: orderedGamesError,
      } = await getUserOrderedGames();
      if (orderedGamesError) errorObj.orderedGames = orderedGamesError;

      const { user, error: userError } = await getUser();
      if (userError) errorObj.auth = userError;

      const { discounts, error: discountsError } = await getDiscounts();
      if (discountsError) errorObj.discounts = discountsError;

      const { games: userGames, error: userGamesError } = await getUserGames();
      if (userGamesError) errorObj.games = userGamesError;

      const {
        usedDiscounts,
        error: usedDiscountsError,
      } = await getUsedDiscounts();
      if (usedDiscountsError) errorObj.usedDiscounts = usedDiscountsError;

      const {
        achievements,
        error: achievementsError,
      } = await getUserAchievements();
      if (achievementsError) errorObj.achievements = achievementsError;

      const ordersForUI = formatOrdersForUI({
        discounts,
        usedDiscounts,
        orderedGames,
        orders,
        games: userGames,
      });

      setUser(user);
      setUserGames(userGames.filter((userGame) => !userGame.isPhysical));
      setOrders(ordersForUI);
      setAchievements(achievements);
      setError(errorObj);
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
              <Link
                to="/profile/orders"
                className={styles.menuLink}
                title="Orders"
              >
                <FaShoppingCart color="#f4f4f4" className={styles.icon} />
                <span className={styles.menuText}>Orders</span>
              </Link>
            </li>
            <li className={`${styles.menuItem} ${styles.active}`}>
              <Link
                to="/profile/achievements"
                className={styles.menuLink}
                title="Achievements"
              >
                <FaStar color="#f4f4f4" className={styles.icon} />
                <span className={styles.menuText}>Achievements</span>
              </Link>
            </li>
            <li className={`${styles.menuItem} ${styles.active}`}>
              <Link
                to="/profile/games"
                className={styles.menuLink}
                title="Games"
              >
                <FaGamepad color="#f4f4f4" className={styles.icon} />
                <span className={styles.menuText}>My games</span>
              </Link>
            </li>
            {user && user.isAdmin && (
              <li className={`${styles.menuItem} ${styles.active}`}>
                <Link
                  className={styles.menuLink}
                  to="/admin"
                  title="Admin panel"
                >
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
                  title="Log out"
                >
                  <RiLogoutBoxRLine color="#f4f4f4" className={styles.icon} />
                  <span className={styles.menuText}>Log out</span>
                </p>
              </li>
            )}
          </ul>

          <div
            className={`${styles.dataContainer} ${isLoading && styles.loading}`}
          >
            <Switch>
              <Route
                path="/profile/orders"
                component={() => (
                  <Orders
                    orders={orders}
                    isLoading={isLoading}
                    error={error.orders}
                  />
                )}
              />
              <Route
                path="/profile/achievements"
                component={() => (
                  <Achievements
                    achievements={achievements}
                    isLoading={isLoading}
                    error={error.achievements}
                  />
                )}
              />
              <Route
                path="/profile/games"
                component={() => (
                  <Games
                    games={userGames}
                    isLoading={isLoading}
                    error={error.games}
                  />
                )}
              />
              <Route component={() => <Redirect to="/profile/orders" />} />
            </Switch>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
