import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { SearchBar } from "../SearchBar";
import { FaUser, FaGamepad, FaShoppingCart, FaBars } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import { useApi } from "context/api";
import { IApiError, IUser } from "interfaces/api";

interface HeaderProps {}

export const Header: React.FunctionComponent<HeaderProps> = () => {
  const history = useHistory();
  const { getGames, getUser } = useApi();
  const [error, setError] = useState<IApiError | null>(null);
  const [user, setUser] = useState<IUser | null>();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const processGames = async () => {
      const { error } = await getGames();
      if (error) setError(error);

      const { user, error: userError } = await getUser();
      if (userError) setError(userError);

      setUser(user);
      setIsLoading(false);
    };
    processGames();
  }, []);

  return (
    <div
      className={`${styles.headerContainer} ${isMenuOpen && styles.overlay}`}
      onClick={() => isMenuOpen && setIsMenuOpen(false)}
    >
      <nav className={styles.navContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.logoContainer} onClick={() => history.push("/")}>
          <FaGamepad size="100%" />
        </div>
        <ul className={`${styles.navList} ${isMenuOpen && styles.open}`}>
          <li
            className={`${styles.navItem} ${
              history.location.pathname === "/store" && styles.active
            }`}
          >
            <Link to="/store" className={styles.link}>
              Store
            </Link>
          </li>
          <li
            className={`${styles.navItem} ${
              history.location.pathname === "/contacts" && styles.active
            }`}
          >
            <Link to="/contacts" className={styles.link}>
              Contacts
            </Link>
          </li>
          <li
            className={`${styles.navItem} ${
              history.location.pathname === "/faq" && styles.active
            }`}
          >
            <Link to="/faq" className={styles.link}>
              FAQ
            </Link>
          </li>
          {user ? (
            <>
              <li className={`${styles.navItem} ${styles.mobileOnlyItem}`}>
                <Link to="/profile" className={styles.link}>
                  <span className={styles.username}>Profile</span>
                </Link>
              </li>
              <li className={`${styles.navItem} ${styles.mobileOnlyItem}`}>
                <Link to="/cart" className={styles.link}>
                  My cart
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className={`${styles.navItem} ${styles.mobileOnlyItem}`}>
                <Link to="/login" className={styles.link}>
                  Login
                </Link>
              </li>
              <li className={`${styles.navItem} ${styles.mobileOnlyItem}`}>
                <Link to="/signup" className={styles.link}>
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
        <button
          className={styles.openMenuBtn}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars size="30px" />
        </button>
      </nav>
      <div className={`${styles.profileContainer}`}>
        <SearchBar />
        {isLoading || error ? (
          <div className={styles.profilePlaceholder}></div>
        ) : user ? (
          <>
            <div
              className={styles.profile}
              onClick={() => history.push("/profile")}
            >
              <div className={styles.iconContainer}>
                <FaUser size="100%" />
              </div>
              <span className={styles.username}>{user.login}</span>
            </div>
            <button
              className={styles.cartBtn}
              onClick={() => history.push("/cart")}
            >
              <div className={styles.iconContainer}>
                <FaShoppingCart size="100%" />
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
