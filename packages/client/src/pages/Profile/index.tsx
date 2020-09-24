import { Header } from "components/Header";
import React, { useEffect, useState } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import styles from "./styles.module.scss";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { Achievements } from "./Achievements";
import { Orders } from "./Orders";
import { IApiError, IOrderFromApi, IGame, IAchievement } from "interfaces/api";
import { useApi } from "context/api";

interface IProfileProps {}

interface IProfileOrder {
  id: number;
  games: IGame[];
  createdAt: string;
  price: number;
}

export const Profile: React.FunctionComponent<IProfileProps> = () => {
  const [error, setError] = useState<IApiError | null>(null);
  const [orders, setOrders] = useState<IProfileOrder[]>([]);
  const [achievements, setAchievements] = useState<IAchievement[]>([]);
  const {
    getUserOrders,
    getUserOrderedGames,
    getGames,
    getUserAchievements,
  } = useApi();

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

      const gamesIds = orderedGames.map((orderedGame) => orderedGame.gameId);
      const userGames = games.filter((el) => gamesIds.includes(el.id));

      setOrders(
        orders.map((order) => {
          const orderGamesIds = orderedGames
            .filter((el) => el.orderId === order.id)
            .map((el) => el.gameId);
          const orderGames = userGames.filter((el) =>
            orderGamesIds.includes(el.id)
          );
          return { ...order, games: orderGames };
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
              <Link to="/profile/orders">
                <FaShoppingCart color="#f4f4f4" className={styles.icon} />
                Orders
              </Link>
            </li>
            <li className={`${styles.menuItem} ${styles.active}`}>
              <Link to="/profile/achievements">
                <FaStar color="#f4f4f4" className={styles.icon} />
                Achievements
              </Link>
            </li>
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
