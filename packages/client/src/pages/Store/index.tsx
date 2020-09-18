import { Header } from "components/Header";
import { useApi } from "context/api";
import { IApiError, IDiscount, IGame, IGameCreator } from "interfaces/api";
import React, { useEffect, useState } from "react";

import styles from "./styles.module.scss";

export const Store = () => {
  const { getGames, getGameCreators, getDiscounts } = useApi();
  const [games, setGames] = useState<IGame[]>([]);
  const [gameCreators, setGameCreators] = useState<IGameCreator[]>([]);
  const [discounts, setDiscounts] = useState<IDiscount[]>([]);

  const [error, setError] = useState<IApiError | null>(null);

  console.log(gameCreators);

  useEffect(() => {
    getGames().then(({ games, error }) => {
      if (error) setError(error);
      else setGames(games as IGame[]);
    });
    getGameCreators().then(({ gameCreators, error }) => {
      if (error) setError(error);
      else setGameCreators(gameCreators as IGameCreator[]);
    });
    getDiscounts().then(({ discounts, error }) => {
      if (error) setError(error);
      else setDiscounts(discounts as IDiscount[]);
    });
  }, []);
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
              {games.map((game) => (
                <li className={styles.gameItem} key={game.id}>
                  <div className={styles.logoContainer}></div>
                  <p className={styles.name}>{game.name}</p>
                  <p className={styles.gameCreator}>
                    {!!gameCreators.length
                      ? gameCreators.filter(
                          (el) => el.id === game.gameCreatorId
                        )[0].name
                      : "Loading.."}
                  </p>
                  <div className={styles.saleBlock}>
                    {/* <span className={styles.saleSize}>{discounts.filter((discount) => discount.)}</span> */}
                    {/* <span className={styles.previousPrice}>15$</span> */}
                    <span className={styles.currentPrice}>{game.price}$</span>
                  </div>
                </li>
              ))}

              {/* <li className={styles.gameItem}>
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
              </li> */}
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

//
