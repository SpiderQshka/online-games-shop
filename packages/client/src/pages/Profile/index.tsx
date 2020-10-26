import { Header } from "components/Header";
import React, { useEffect, useState } from "react";
import { Switch, Route, Link, Redirect, useHistory } from "react-router-dom";
import styles from "./styles.module.scss";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { RiAdminLine, RiLogoutBoxRLine } from "react-icons/ri";
import { Achievements } from "./Achievements";
import { Orders } from "./Orders";
import {
  IApiError,
  IUser,
  IAchievementFromApi,
  IGameForOrder,
} from "interfaces/api";
import { useApi } from "context/api";
import { IOrderForUI, OrderWithUserId } from "interfaces/app";
import { useAuth } from "context/auth";
import { getGameHightestDiscount, removeUserSessionData } from "utils/helpers";
import { usePopup } from "context/popup";

interface IProfileProps {}

export const Profile: React.FunctionComponent<IProfileProps> = () => {
  const history = useHistory();
  const { showPopup } = usePopup();
  const [error, setError] = useState<IApiError | null>(null);
  const [orders, setOrders] = useState<IOrderForUI[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [achievements, setAchievements] = useState<IAchievementFromApi[]>([]);
  const {
    getUserOrders,
    getUserOrderedGames,
    getGames,
    getUserAchievements,
    getUser,
    getDiscounts,
    getUsedDiscounts,
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

      const { games, error: gamesError } = await getGames();
      if (gamesError) setError(gamesError);

      const { user, error: userError } = await getUser();
      if (userError) setError(userError);

      const { discounts, error: discountsError } = await getDiscounts();
      if (discountsError) setError(discountsError);

      const {
        usedDiscounts,
        error: usedDiscountsError,
      } = await getUsedDiscounts();
      if (usedDiscountsError) setError(usedDiscountsError);

      const gamesIds = orderedGames.map((orderedGame) => orderedGame.gameId);
      const userGames = games.filter((el) => gamesIds.includes(el.id));

      const ordersForUI: OrderWithUserId[] = orders.map((order) => {
        const gamesIds = orderedGames
          .filter((el) => +el.orderId === +order.id)
          .map((el) => el.gameId);
        const gamePhysicalDublicates: IGameForOrder[] = [];

        const gamesForOrder: IGameForOrder[] = userGames
          .filter((game) => gamesIds.includes(game.id))
          .map((game) => {
            const gameDiscountsIds = usedDiscounts
              .filter((el) => el.gameId === game?.id)
              .map((el) => el.discountId);
            const doesGameHavePhysicalDublicate =
              orderedGames.filter(
                (el) => el.gameId === game.id && el.orderId === order.id
              ).length > 1;
            const discount = getGameHightestDiscount({
              discounts,
              game,
              gameDiscountsIds,
            });
            if (doesGameHavePhysicalDublicate) {
              gamePhysicalDublicates.push({
                ...game,
                isPhysical: true,
                discount,
              });
              return {
                ...game,
                isPhysical: false,
                discount,
              };
            }
            return {
              ...game,
              isPhysical: orderedGames.filter(
                (el) => el.gameId === game.id && el.orderId === order.id
              )[0].isPhysical,
              discount,
            };
          });

        gamesForOrder.push(...gamePhysicalDublicates);

        const userId = orderedGames.filter(
          (orderedGame) => orderedGame.orderId === order.id
        )[0].userId;
        return {
          ...order,
          orderedGames: gamesForOrder,
          userId,
        };
      });

      const { achievements, error } = await getUserAchievements();
      if (error) setError(error);

      setUser(user);

      setOrders(ordersForUI);

      setAchievements(achievements);
      setIsLoading(false);
    };
    processAsync();
  }, []);

  useEffect(() => {
    if (error) showPopup({ type: "error", msg: error.msg, code: error.status });
  }, [error]);

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
                    removeUserSessionData();
                    history.push("/");
                  }}
                >
                  <RiLogoutBoxRLine color="#f4f4f4" className={styles.icon} />
                  <span className={styles.menuText}>Log out</span>
                </p>
              </li>
            )}
          </ul>
          <div className={styles.dataContainer}>
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
              <Route component={() => <Redirect to="/profile/orders" />} />
            </Switch>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
