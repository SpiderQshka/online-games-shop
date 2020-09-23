import { useApi } from "context/api";
import { IApiError, IGame, IOrderFromApi } from "interfaces/api";
import React, { useEffect, useState } from "react";
import { getUserSessionData } from "utils/helpers";
import styles from "./styles.module.scss";
import _ from "lodash";
import Aigle from "aigle";
import { Header } from "components/Header";

Aigle.mixin(_, {});

export const Cart = () => {
  const { getGame, getDiscounts, getUsedDiscounts } = useApi();
  const [games, setGames] = useState<IGame[]>([]);
  const [error, setError] = useState<IApiError | null>(null);
  useEffect(() => {
    const processGames = async () => {
      const gamesIds = [1, 2];
      const games = await Aigle.map(gamesIds, (gameId) =>
        getGame(gameId).then(({ game, error }) => {
          if (error) setError(error);
          else return game;
        })
      );
      //   const {usedDiscounts,error: usedDiscountsError} = await getUsedDiscounts()
      //   if (usedDiscountsError) setError(usedDiscountsError);

      //   const {discounts,error: discountsError} = await getDiscounts()
      //   if (discountsError) setError(discountsError);

      setGames(games.filter((game) => !!game) as IGame[]);
    };
    processGames();
  }, []);
  return (
    <>
      <Header />
      <div className={styles.cartContainer}>
        <div className={styles.cartContent}>
          <div className={styles.cartListContainer}>
            <h2 className={styles.header}>My cart</h2>

            <ul className={styles.cartList}>
              <li className={`${styles.cartItem} ${styles.headerItem}`}>
                <span className={styles.name}>Name</span>
                <span className={styles.price}>Price</span>
              </li>
              {games.map((game) => (
                <li className={styles.cartItem} key={game.id}>
                  <span className={styles.name}>{game.name}</span>
                  <span className={styles.price}>{game.price} $</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.totalBlockContainer}>
            <h2 className={styles.header}>Total</h2>
            <p className={styles.totalPrice}>
              <span>Sub-total</span>
              <span className={styles.price}>
                {games.reduce((prev, curr) => prev + +curr.price, 0)} $
              </span>
            </p>
            <div className={styles.actionsBlock}>
              <button className={styles.submitBtn}>That's it!</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
