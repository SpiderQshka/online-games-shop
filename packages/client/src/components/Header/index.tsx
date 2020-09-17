import { useAuth } from "context/auth";
import React from "react";
import styles from "./styles.module.scss";
import { SearchBar } from "../SearchBar";
import { FaUser, FaGamepad } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";

interface HeaderProps {}

export const Header: React.FunctionComponent<HeaderProps> = () => {
  const history = useHistory();
  const { token } = useAuth();
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
        <SearchBar
          games={[
            { name: "1", id: 1 },
            { name: "2", id: 2 },
            { name: "12", id: 12 },
          ]}
        />
        {token ? (
          <div
            className={styles.profile}
            onClick={() => history.push("/profile")}
          >
            <div className={styles.iconContainer}>
              <FaUser size="100%" />
            </div>
            <span className={styles.username}>Username</span>
          </div>
        ) : (
          <div className={styles.unauthProfile}>
            <button className={`${styles.actionBtn} ${styles.logInBtn}`}>
              Log In
            </button>
            <button className={`${styles.actionBtn} ${styles.signUpBtn}`}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
