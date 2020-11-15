import { useApi } from "context/api";
import { IApiError, IGameForOrder, IGameFromApi } from "interfaces/api";
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
import { FaEdit, FaTimes } from "react-icons/fa";

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
  } = useApi();
  const [games, setGames] = useState<IGameForOrder[]>([]);
  const [error, setError] = useState<IApiError | null>(null);
  const [achievementDiscount, setAchievementDiscount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const processGames = async () => {
      const gamesFromSessionData = getCartData();

      const { discounts, error: discountsError } = await getDiscounts();
      if (discountsError) setError(discountsError);

      const {
        usedDiscounts,
        error: usedDiscountsError,
      } = await getUsedDiscounts();
      if (usedDiscountsError) setError(usedDiscountsError);

      const {
        gameCreators,
        error: gameCreatorsError,
      } = await getGameCreators();
      if (gameCreatorsError) setError(gameCreatorsError);

      const { genres, error: genresError } = await getGenres();
      if (genresError) setError(genresError);

      const { usedGenres, error: useGenresError } = await getUsedGenres();
      if (useGenresError) setError(useGenresError);

      const games = await Aigle.map(gamesFromSessionData, (game, i) =>
        getGame(game.id).then(({ game, error }) => {
          if (error) setError(error);
          else return game;
        })
      );

      const {
        achievements: userAchievements,
        error: userAchievementsError,
      } = await getUserAchievements();
      if (userAchievementsError) setError(userAchievementsError);

      const formattedGames = formatGamesForUI({
        discounts,
        gameCreators,
        genres,
        usedDiscounts,
        usedGenres,
        games: games.filter((game) => game !== undefined) as IGameFromApi[],
        userAchievements,
      });

      setGames(
        formattedGames.map((game, i) => ({
          ...game,
          isPhysical: gamesFromSessionData[i].isPhysical,
        }))
      );
      setAchievementDiscount(
        getAchievementDiscountSize({
          userAchievements,
        })
      );
      setIsLoading(false);
    };
    processGames();
  }, [getCartData.length]);

  const submitHandler = useCallback(async () => {
    await Aigle.map(games, (game) =>
      unblockGame(game.id).then(({ error }) => error && setError(error))
    );
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
        setCartData([]);
        const orderForUI = { ...order, orderedGames: games };
        history.push("/cart/success", orderForUI);
      }
    });
  }, [games]);

  const clearCartHandler = useCallback(() => {
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

  useEffect(() => {
    if (error) history.push("/error", error);
  }, [error]);

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
                  <span className={styles.price}>
                    {games
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
                      .toFixed(2)}
                    $
                  </span>
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
      )}
    </>
  );
};

export default Cart;
