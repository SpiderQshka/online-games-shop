import { Header } from "components/Header";
import React, { useEffect, useState } from "react";
import { Switch, Route, Link, Redirect, useHistory } from "react-router-dom";
import styles from "./styles.module.scss";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { RiAdminLine, RiLogoutBoxRLine } from "react-icons/ri";
import { Achievements } from "./Achievements";
import { Orders } from "./Orders";
import { IApiError, IGame, IAchievement, IUser } from "interfaces/api";
import { useApi } from "context/api";
import { IOrderForUI } from "interfaces/app";
import { useAuth } from "context/auth";

interface IProfileProps {}

export const Profile: React.FunctionComponent<IProfileProps> = () => {
  const history = useHistory();
  const [error, setError] = useState<IApiError | null>(null);
  const [orders, setOrders] = useState<IOrderForUI[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [achievements, setAchievements] = useState<IAchievement[]>([]);
  const {
    getUserOrders,
    getUserOrderedGames,
    getGames,
    getUserAchievements,
    getUser,
  } = useApi();
  const { token } = useAuth();

  useEffect(() => {
    const processOrders = async () => {
      const { orders, error: ordersError } = await getUserOrders();
      if (ordersError) setError(ordersError);

      const {
        orderedGames,
        error: orderedGamesError,
      } = await getUserOrderedGames();
      if (orderedGamesError) setError(orderedGamesError);

      const { games, error: gamesError } = await getGames();
      if (gamesError) setError(gamesError);

      const { user, error: userError } = await getUser();
      if (userError) setError(userError);

      const gamesIds = orderedGames.map((orderedGame) => orderedGame.gameId);
      const userGames = games.filter((el) => gamesIds.includes(el.id));

      setUser(user);

      setOrders(
        orders.map((order) => {
          const orderGamesIds = orderedGames
            .filter((el) => el.orderId === order.id)
            .map((el) => el.gameId);
          const orderGames = userGames.filter((el) =>
            orderGamesIds.includes(el.id)
          );
          return { ...order, orderedGames: orderGames };
        })
      );
    };
    const processAchievements = async () => {
      const { achievements, error } = await getUserAchievements();
      if (error) setError(error);
      else setAchievements(achievements);
    };
    processOrders();
    processAchievements();
  }, []);
  return (
    <>
      <Header />
      <div className={styles.profileContainer}>
        <div className={styles.profileContent}>
          <ul className={styles.menuList}>
            <li className={`${styles.menuItem} ${styles.active}`}>
              <Link to="/profile/orders" className={styles.menuText}>
                <FaShoppingCart color="#f4f4f4" className={styles.icon} />
                Orders
              </Link>
            </li>
            <li className={`${styles.menuItem} ${styles.active}`}>
              <Link to="/profile/achievements" className={styles.menuText}>
                <FaStar color="#f4f4f4" className={styles.icon} />
                Achievements
              </Link>
            </li>
            {user?.isAdmin && (
              <li className={`${styles.menuItem} ${styles.active}`}>
                <Link className={styles.menuText} to="/admin">
                  <RiAdminLine color="#f4f4f4" className={styles.icon} />
                  Go to admin panel
                </Link>
              </li>
            )}
            {user && (
              <li className={`${styles.menuItem} ${styles.active}`}>
                <p
                  className={styles.menuText}
                  onClick={() => {
                    window.localStorage.removeItem("token");
                    history.push("/");
                  }}
                >
                  <RiLogoutBoxRLine color="#f4f4f4" className={styles.icon} />
                  Log out
                </p>
              </li>
            )}
          </ul>
          <div className={styles.dataContainer}>
            <Switch>
              <Route
                path="/profile/orders"
                component={() => <Orders orders={orders} />}
              />
              <Route
                path="/profile/achievements"
                component={() => <Achievements achievements={achievements} />}
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
