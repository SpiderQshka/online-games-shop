import { useApi } from "context/api";
import { IApiError, IGame, IOrderFromApi } from "interfaces/api";
import React, { useEffect, useState } from "react";
import { getUserSessionData } from "utils/helpers";
import styles from "./styles.module.scss";
import _ from "lodash";
import Aigle from "aigle";
import { Header } from "components/Header";
import { useHistory } from "react-router-dom";
import { GiTumbleweed } from "react-icons/gi";

Aigle.mixin(_, {});

export const Cart = () => {
  const history = useHistory();
  const { getGame, getDiscounts, getUsedDiscounts, postOrder } = useApi();
  const [games, setGames] = useState<IGame[]>([]);
  const [error, setError] = useState<IApiError | null>(null);

  useEffect(() => {
    const processGames = async () => {
      const gamesIds = getUserSessionData();

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

  const submitHandler = () => {
    postOrder({ gamesIds: games.map((game) => +game.id) }).then(
      ({ order, error }) => {
        if (error) setError(error);
        else {
          setGames([]);
          history.push("/profile");
        }
      }
    );
  };
  return (
    <>
      <Header />
      <div className={styles.cartContainer}>
        {games.length ? (
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
                <button
                  className={styles.submitBtn}
                  onClick={() => submitHandler()}
                >
                  That's it!
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyCartContent}>
            <div className={styles.iconContainer}>
              <GiTumbleweed size="100%" />
            </div>
            <h2 className={styles.header}>Empty cart</h2>
            <p className={styles.text}>
              Looks like your cart is empty for now...
            </p>
            <button
              className={styles.btn}
              onClick={() => history.push("/store")}
            >
              Back to store
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
