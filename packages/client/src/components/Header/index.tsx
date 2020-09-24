import { useAuth } from "context/auth";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { SearchBar } from "../SearchBar";
import { FaUser, FaGamepad, FaShoppingCart } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import { useApi } from "context/api";
import { IApiError, IGame } from "interfaces/api";

interface HeaderProps {}

export const Header: React.FunctionComponent<HeaderProps> = () => {
  const history = useHistory();
  const { token } = useAuth();
  const { getGames } = useApi();
  const [error, setError] = useState<IApiError | null>(null);
  const [games, setGames] = useState<IGame[]>([]);
  useEffect(() => {
    const processGames = async () => {
      const { games, error } = await getGames();
      if (error) setError(error);

      setGames(games);
    };
    processGames();
  }, []);
  return (
    <div className={styles.headerContainer}>
      <nav className={styles.navContainer}>
        <div className={styles.logoContainer}>
          <FaGamepad size="100%" />
        </div>
        <ul className={styles.navList}>
          <li className={`${styles.navItem}`}>
            <Link to="/store">Store</Link>
          </li>
          <li className={`${styles.navItem}`}>
            <Link to="/contacts">Contacts</Link>
          </li>
          <li className={`${styles.navItem}`}>
            <Link to="/delivery">Delivery</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.profileContainer}>
        <SearchBar games={games} />
        {token ? (
          <>
            <div
              className={styles.profile}
              onClick={() => history.push("/profile")}
            >
              <div className={styles.iconContainer}>
                <FaUser size="100%" />
              </div>
              <span className={styles.username}>Username</span>
            </div>
            <button className={styles.cartBtn}>
              <div className={styles.iconContainer}>
                <FaShoppingCart
                  size="100%"
                  onClick={() => history.push("/cart")}
                />
              </div>
            </button>
          </>
        ) : (
          <div className={styles.unauthProfile}>
            <button
              className={`${styles.actionBtn} ${styles.logInBtn}`}
              onClick={() => history.push("/login")}
            >
              Log In
            </button>
            <button
              className={`${styles.actionBtn} ${styles.signUpBtn}`}
              onClick={() => history.push("/signup")}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
