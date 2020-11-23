import { useApi } from "context/api";
import { IGameForOrder, IGameFromApi } from "interfaces/api";
import React, { useCallback, useEffect, useState } from "react";
import {
  getOptimalGamePrice,
  formatGamesForUI,
  getAchievementDiscountSize,
  getCartData,
  setCartData,
  removeCartData,
} from "utils/helpers";
import styles from "./styles.module.scss";
import _ from "lodash";
import Aigle from "aigle";
import { Header } from "components/Header";
import { useHistory } from "react-router-dom";
import { GiTumbleweed } from "react-icons/gi";
import { Loader } from "components/Loader";
import { FaTimes } from "react-icons/fa";
import { Error } from "components/Error";
import { defaultErrorObj, IErrorObject } from "interfaces/app";

Aigle.mixin(_, {});

export const Cart = () => {
  const history = useHistory();
  const {
    getGame,
    postOrder,
    unblockGame,
    getDiscounts,
    getUsedDiscounts,
    getUserAchievements,
    getGameCreators,
    getGenres,
    getUsedGenres,
    blockGame,
  } = useApi();
  const [games, setGames] = useState<IGameForOrder[]>([]);
  const [error, setError] = useState<IErrorObject>(defaultErrorObj);
  const [achievementDiscount, setAchievementDiscount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const processGames = async () => {
      const errorObj = { ...defaultErrorObj } as IErrorObject;

      const gamesFromSessionData = getCartData();

      const { discounts, error: discountsError } = await getDiscounts();
      if (discountsError) errorObj.discounts = discountsError;

      const {
        usedDiscounts,
        error: usedDiscountsError,
      } = await getUsedDiscounts();
      if (usedDiscountsError) errorObj.usedDiscounts = usedDiscountsError;

      const {
        gameCreators,
        error: gameCreatorsError,
      } = await getGameCreators();
      if (gameCreatorsError) errorObj.gameCreators = gameCreatorsError;

      const { genres, error: genresError } = await getGenres();
      if (genresError) errorObj.genres = genresError;

      const { usedGenres, error: usedGenresError } = await getUsedGenres();
      if (usedGenresError) errorObj.usedGenres = usedGenresError;

      const games = await Aigle.map(gamesFromSessionData, (game) =>
        getGame(game.id).then(({ game, error }) => {
          if (error) errorObj.games = error;
          else return game;
        })
      );

      const {
        achievements: userAchievements,
        error: userAchievementsError,
      } = await getUserAchievements();
      if (userAchievementsError) errorObj.achievements = userAchievementsError;

      const formattedGames = formatGamesForUI({
        discounts,
        gameCreators,
        genres,
        usedDiscounts,
        usedGenres,
        games: games.filter((game) => game !== undefined) as IGameFromApi[],
        userAchievements,
      }).map((game, i) => ({
        ...game,
        isPhysical: gamesFromSessionData[i].isPhysical,
      }));

      setGames(formattedGames);
      setAchievementDiscount(
        getAchievementDiscountSize({
          userAchievements,
        })
      );
      setError(errorObj);
      setIsLoading(false);
    };
    processGames();
  }, [getCartData.length]);

  const blockGames = useCallback(
    () =>
      Aigle.map(games, (game) =>
        blockGame(game.id).then(
          ({ error: gameError }) =>
            gameError && setError({ ...error, games: gameError || null })
        )
      ),
    [games.length]
  );

  const unblockGames = useCallback(
    () =>
      Aigle.map(games, (game) =>
        unblockGame(game.id).then(
          ({ error: gameError }) =>
            gameError && setError({ ...error, games: gameError || null })
        )
      ),
    [games.length]
  );

  const submitHandler = useCallback(async () => {
    await unblockGames();
    const gamesIds = games
      .filter((game) => !game.isPhysical)
      .map((game) => +game.id);

    const physicalGamesCopiesIds = games
      .filter((game) => game.isPhysical)
      .map((game) => +game.id);

    const { order, error: orderError } = await postOrder({
      gamesIds,
      status: "pending",
      physicalGamesCopiesIds,
    });

    if (orderError) {
      setError({ ...error, orders: orderError || null });
      await blockGames();
    } else {
      setGames([]);
      setCartData([]);
      const orderForUI = { ...order, orderedGames: games };
      history.push("/cart/success", orderForUI);
    }
  }, [games]);

  const clearCartHandler = useCallback(async () => {
    await unblockGames();
    removeCartData();
    history.push("/");
  }, []);

  const removeCartItemHandler = useCallback(
    (gameId: number, isPhysical: boolean) => {
      const cartGames = getCartData();

      setCartData(
        cartGames.filter(
          (game) => !(game.id === gameId && game.isPhysical === isPhysical)
        )
      );
      setGames(
        games.filter(
          (game) => !(game.id === gameId && game.isPhysical === isPhysical)
        )
      );
    },
    [games.length]
  );

  const totalPrice = games
    .reduce(
      (prev, curr) =>
        prev +
        +getOptimalGamePrice({
          achievementDiscount,
          game: curr,
          isPhysical: curr.isPhysical,
        }),
      0
    )
    .toFixed(2);

  return (
    <>
      <Header />
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      ) : (
        <div className={styles.cartContainer}>
          {games.length ? (
            <div className={styles.cartContent}>
              <div className={styles.cartListContainer}>
                <h2 className={styles.header}>My cart</h2>

                <ul className={styles.cartList}>
                  <li className={`${styles.cartItem} ${styles.headerItem}`}>
                    <span className={`${styles.col} ${styles.name}`}>Name</span>
                    <span className={`${styles.col} ${styles.price}`}>
                      Price
                    </span>
                    <span className={`${styles.col} ${styles.action}`}></span>
                  </li>
                  {games.map((game) => (
                    <li className={styles.cartItem} key={game.id}>
                      <span
                        className={`${styles.col} ${styles.name}`}
                        onClick={() => history.push(`/store/item/${game.id}`)}
                      >
                        {game.name}
                        {game.isPhysical && (
                          <span className={styles.accent}>Physical copy</span>
                        )}
                      </span>
                      <span className={`${styles.col} ${styles.price}`}>
                        {getOptimalGamePrice({
                          achievementDiscount,
                          game,
                          isPhysical: game.isPhysical,
                        })}
                        $
                      </span>
                      <span className={`${styles.col} ${styles.action}`}>
                        <button
                          className={styles.btn}
                          onClick={() =>
                            removeCartItemHandler(game.id, game.isPhysical)
                          }
                        >
                          <FaTimes size={"100%"} />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.totalBlockContainer}>
                <h2 className={styles.header}>Total</h2>
                <p className={styles.totalPrice}>
                  <span>Sub-total</span>
                  <span className={styles.price}>{totalPrice}$</span>
                </p>
                <div className={styles.actionsBlock}>
                  <button
                    className={`${styles.btn} ${styles.submitBtn}`}
                    onClick={() => submitHandler()}
                  >
                    Order
                  </button>
                  <button
                    className={`${styles.btn} ${styles.clearBtn}`}
                    onClick={() => clearCartHandler()}
                  >
                    Clear cart
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`${styles.emptyCartContent} ${
                error.games && styles.error
              }`}
            >
              {error.games ? (
                <Error />
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Cart;
