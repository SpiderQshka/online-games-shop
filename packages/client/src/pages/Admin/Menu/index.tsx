import React from "react";
import { FaGamepad, FaPercent, FaStar, FaTheaterMasks } from "react-icons/fa";
import { MdDashboard, MdDeveloperMode } from "react-icons/md";
import { RiLogoutBoxRLine, RiShoppingCart2Line } from "react-icons/ri";
import { Link, useHistory } from "react-router-dom";
import styles from "./styles.module.scss";

interface MenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const Menu: React.FunctionComponent<MenuProps> = ({
  isMenuOpen,
  setIsMenuOpen,
}) => {
  const history = useHistory();
  return (
    <div
      className={`${styles.menuContainer} ${isMenuOpen && styles.openedMenu}`}
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className={styles.header}>Menu</h2>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <Link
            to="/admin/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className={`${styles.menuLink} ${
              history.location.pathname.includes("/admin/dashboard") &&
              styles.active
            }`}
          >
            <MdDashboard size="20px" className={styles.icon} /> Dashboard
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link
            to="/admin/orders"
            onClick={() => setIsMenuOpen(false)}
            className={`${styles.menuLink} ${
              history.location.pathname.includes("/admin/orders") &&
              styles.active
            }`}
          >
            <RiShoppingCart2Line size="20px" className={styles.icon} />
            Orders
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link
            to="/admin/games"
            onClick={() => setIsMenuOpen(false)}
            className={`${styles.menuLink} ${
              history.location.pathname.includes("/admin/games") &&
              styles.active
            }`}
          >
            <FaGamepad size="20px" className={styles.icon} />
            Games
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link
            to="/admin/gameCreators"
            onClick={() => setIsMenuOpen(false)}
            className={`${styles.menuLink} ${
              history.location.pathname.includes("/admin/gameCreators") &&
              styles.active
            }`}
          >
            <MdDeveloperMode size="20px" className={styles.icon} />
            Game creators
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link
            to="/admin/achievements"
            onClick={() => setIsMenuOpen(false)}
            className={`${styles.menuLink} ${
              history.location.pathname.includes("/admin/achievements") &&
              styles.active
            }`}
          >
            <FaStar size="20px" className={styles.icon} />
            Achievements
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link
            to="/admin/discounts"
            onClick={() => setIsMenuOpen(false)}
            className={`${styles.menuLink} ${
              history.location.pathname.includes("/admin/discounts") &&
              styles.active
            }`}
          >
            <FaPercent size="20px" className={styles.icon} />
            Discounts
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link
            to="/admin/genres"
            onClick={() => setIsMenuOpen(false)}
            className={`${styles.menuLink} ${
              history.location.pathname.includes("/admin/genres") &&
              styles.active
            }`}
          >
            <FaTheaterMasks size="20px" className={styles.icon} />
            Genres
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={`${styles.menuLink}`}
          >
            <RiLogoutBoxRLine size="20px" className={styles.icon} />
            Go out
          </Link>
        </li>
      </ul>
    </div>
  );
};
