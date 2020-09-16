import { Header } from "components/Header";
import React from "react";

import styles from "./styles.module.scss";

export const Store = () => {
  return (
    <>
      <Header />
      <div className={styles.storeContainer}>
        <div className={styles.storeContent}>
          <div className={styles.gamesContainer}>
            <div className={styles.infoContainer}>
              <span className={styles.text}>Sort by</span>
              <select name="sortBy" className={styles.sortBySelect}>
                <option value="creationDate" className={styles.sortByItem}>
                  Creation date
                </option>
                <option value="alphabet" className={styles.sortByItem}>
                  Alphabet
                </option>
              </select>
            </div>
            <ul className={styles.gamesList}>
              <li className={styles.gameItem}>
                <div className={styles.logoContainer}></div>
                <p className={styles.name}>Game</p>
                <p className={styles.gameCreator}>Game creator</p>
                <div className={styles.saleBlock}>
                  <span className={styles.saleSize}>-20%</span>
                  <span className={styles.previousPrice}>15$</span>
                  <span className={styles.currentPrice}>10$</span>
                </div>
              </li>
              <li className={styles.gameItem}>
                <div className={styles.logoContainer}></div>
                <p className={styles.name}>Game</p>
                <p className={styles.gameCreator}>Game creator</p>
                <div className={styles.saleBlock}>
                  <span className={styles.saleSize}>-20%</span>
                  <span className={styles.previousPrice}>15$</span>
                  <span className={styles.currentPrice}>10$</span>
                </div>
              </li>
              <li className={styles.gameItem}>
                <div className={styles.logoContainer}></div>
                <p className={styles.name}>Game</p>
                <p className={styles.gameCreator}>Game creator</p>
                <div className={styles.saleBlock}>
                  <span className={styles.saleSize}>-20%</span>
                  <span className={styles.previousPrice}>15$</span>
                  <span className={styles.currentPrice}>10$</span>
                </div>
              </li>
              <li className={styles.gameItem}>
                <div className={styles.logoContainer}></div>
                <p className={styles.name}>Game</p>
                <p className={styles.gameCreator}>Game creator</p>
                <div className={styles.saleBlock}>
                  <span className={styles.saleSize}>-20%</span>
                  <span className={styles.previousPrice}>15$</span>
                  <span className={styles.currentPrice}>10$</span>
                </div>
              </li>
              <li className={styles.gameItem}>
                <div className={styles.logoContainer}></div>
                <p className={styles.name}>Game</p>
                <p className={styles.gameCreator}>Game creator</p>
                <div className={styles.saleBlock}>
                  <span className={styles.saleSize}>-20%</span>
                  <span className={styles.previousPrice}>15$</span>
                  <span className={styles.currentPrice}>10$</span>
                </div>
              </li>
              <li className={styles.gameItem}>
                <div className={styles.logoContainer}></div>
                <p className={styles.name}>Game</p>
                <p className={styles.gameCreator}>Game creator</p>
                <div className={styles.saleBlock}>
                  <span className={styles.saleSize}>-20%</span>
                  <span className={styles.previousPrice}>15$</span>
                  <span className={styles.currentPrice}>10$</span>
                </div>
              </li>
              <li className={styles.gameItem}>
                <div className={styles.logoContainer}></div>
                <p className={styles.name}>Game</p>
                <p className={styles.gameCreator}>Game creator</p>
                <div className={styles.saleBlock}>
                  <span className={styles.saleSize}>-20%</span>
                  <span className={styles.previousPrice}>15$</span>
                  <span className={styles.currentPrice}>10$</span>
                </div>
              </li>
              <li className={styles.gameItem}>
                <div className={styles.logoContainer}></div>
                <p className={styles.name}>Game</p>
                <p className={styles.gameCreator}>Game creator</p>
                <div className={styles.saleBlock}>
                  <span className={styles.saleSize}>-20%</span>
                  <span className={styles.previousPrice}>15$</span>
                  <span className={styles.currentPrice}>10$</span>
                </div>
              </li>
            </ul>
          </div>
          <div className={styles.filtersContainer}>
            <h5 className={styles.header}>Filters</h5>
            <select className={`${styles.filterItem} ${styles.categories}`}>
              <option value="rpg">RPG</option>
            </select>
            <select className={`${styles.filterItem} ${styles.gameCreators}`}>
              <option value="gameCreator">Game creator</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};
