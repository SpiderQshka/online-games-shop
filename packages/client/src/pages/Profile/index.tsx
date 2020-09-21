import { Header } from "components/Header";
import React, { useEffect, useState } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import styles from "./styles.module.scss";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { Achievements } from "./Achievements";
import { Orders } from "./Orders";
import { IApiError, IOrderFromApi } from "interfaces/api";
import { useApi } from "context/api";

interface IProfileProps {}

export const Profile: React.FunctionComponent<IProfileProps> = () => {
  const [error, setError] = useState<IApiError | null>(null);
  const [orders, setOrders] = useState<IOrderFromApi[]>([]);
  const { getUserOrderedGames } = useApi();
  useEffect(() => {
    getUserOrderedGames().then(({ orderedGames, error }) => {
      if (error) setError(error);
      else {
        setOrders(sortGames(games, sortType));
        setFilteredGames(sortGames(games, sortType));
      }
    });
  });
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
                component={() => (
                  <Orders
                    orders={
                      [
                        // {
                        //   date: "11/10/2002",
                        //   games: [
                        //     { name: "Game", id: 1 },
                        //     { name: "Game 2", id: 2 },
                        //   ],
                        //   price: 20,
                        // },
                        // {
                        //   date: "11/10/2002",
                        //   games: [
                        //     { name: "Game", id: 1 },
                        //     { name: "Game 2", id: 2 },
                        //   ],
                        //   price: 20,
                        // },
                      ]
                    }
                  />
                )}
              />
              <Route
                path="/profile/achievements"
                component={() => (
                  <Achievements
                    achievements={
                      [
                        // { discountSize: 15, name: "Hey" },
                        // { discountSize: 25, name: "Hoy" },
                      ]
                    }
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
