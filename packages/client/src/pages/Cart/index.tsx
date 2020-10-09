import { useApi } from "context/api";
import { IApiError, IGameForOrder } from "interfaces/api";
import React, { useCallback, useEffect, useState } from "react";

import { getUserSessionData, setUserSessionData } from "utils/helpers";
import styles from "./styles.module.scss";
import _ from "lodash";
import Aigle from "aigle";
import { Header } from "components/Header";
import { useHistory } from "react-router-dom";
import { GiTumbleweed } from "react-icons/gi";
import { Loader } from "components/Loader";

Aigle.mixin(_, {});

export const Cart = () => {
  const history = useHistory();
  const { getGame, postOrder } = useApi();
  const [games, setGames] = useState<IGameForOrder[]>([]);
  const [error, setError] = useState<IApiError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const processGames = async () => {
      const gamesFromSessionData = getUserSessionData();
      const games = await Aigle.map(gamesFromSessionData, (game, i) =>
        getGame(game.id).then(({ game, error }) => {
          if (error) setError(error);
          else
            return { ...game, isPhysical: gamesFromSessionData[i].isPhysical };
        })
      );

      setGames(games.filter((game) => !!game) as IGameForOrder[]);
      setIsLoading(false);
    };
    processGames();
  }, []);

  const submitHandler = useCallback(() => {
    postOrder({
      gamesIds: games
        .filter((game) => !game.isPhysical)
        .map((game) => +game.id),
      status: "pending",
      physicalGamesCopiesIds: games
        .filter((game) => game.isPhysical)
        .map((game) => +game.id),
    }).then(({ order, error }) => {
      if (error) setError(error);
      else {
        setGames([]);
        setUserSessionData([]);
        const orderForUI = { ...order, orderedGames: games };
        history.push("/cart/success", orderForUI);
      }
    });
  }, [games]);
  return (
    <>
      <Header />
      <div className={styles.cartContainer}>
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : games.length ? (
          <div className={styles.cartContent}>
            <div className={styles.cartListContainer}>
              <h2 className={styles.header}>My cart</h2>

              <ul className={styles.cartList}>
                <li className={`${styles.cartItem} ${styles.headerItem}`}>
                  <span className={`${styles.row} ${styles.name}`}>Name</span>
                  <span className={`${styles.row} ${styles.price}`}>Price</span>
                </li>
                {games.map((game) => (
                  <li className={styles.cartItem} key={game.id}>
                    <span className={`${styles.row} ${styles.name}`}>
                      {game.name}
                      {game.isPhysical && (
                        <span className={styles.accent}>Physical copy</span>
                      )}
                    </span>
                    <span className={`${styles.row} ${styles.price}`}>
                      {!game.isPhysical ? game.price : game.physicalCopyPrice} $
                    </span>
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
