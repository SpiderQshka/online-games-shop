import { useApi } from "context/api";
import { IApiError, IGameForOrder, IGameFromApi } from "interfaces/api";
import React, { useCallback, useEffect, useState } from "react";
import {
  getOptimalGamePrice,
  formatGamesForUI,
  getAchievementDiscountSize,
  getUserSessionData,
  setUserSessionData,
} from "utils/helpers";
import styles from "./styles.module.scss";
import _ from "lodash";
import Aigle from "aigle";
import { Header } from "components/Header";
import { useHistory } from "react-router-dom";
import { GiTumbleweed } from "react-icons/gi";
import { Loader } from "components/Loader";
import { usePopup } from "context/popup";

Aigle.mixin(_, {});

export const Cart = () => {
  const history = useHistory();
  const { showPopup } = usePopup();
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
      const gamesFromSessionData = getUserSessionData();

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
  }, []);

  useEffect(() => {
    if (error) showPopup({ type: "error", msg: error.msg, code: error.status });
  }, [error]);

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
        setUserSessionData([]);
        const orderForUI = { ...order, orderedGames: games };
        history.push("/cart/success", orderForUI);
      }
    });
  }, [games]);

  useEffect(() => {
    if (error) showPopup({ type: "error", msg: error.msg, code: error.status });
  }, [error]);

  return (
    <>
      <Header />
      {isLoading || error ? (
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
                    <span className={`${styles.row} ${styles.name}`}>Name</span>
                    <span className={`${styles.row} ${styles.price}`}>
                      Price
                    </span>
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
                        {getOptimalGamePrice({
                          achievementDiscount,
                          game,
                          isPhysical: game.isPhysical,
                        })}
                        $
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
                    {games.reduce(
                      (prev, curr) =>
                        prev +
                        getOptimalGamePrice({
                          achievementDiscount,
                          game: curr,
                          isPhysical: curr.isPhysical,
                        }),
                      0
                    )}
                    $
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
      )}
    </>
  );
};

export default Cart;
