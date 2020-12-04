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
import { Counter } from "components/Counter";
import { usePopup } from "context/popup";

Aigle.mixin(_, {});

type GameCopyNumber = { gameId: number; copiesNumber: number };

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
  const { showPopup } = usePopup();
  const [games, setGames] = useState<IGameForOrder[]>([]);
  const [error, setError] = useState<IErrorObject>(defaultErrorObj);
  const [achievementDiscount, setAchievementDiscount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRequestSending, setIsRequestSending] = useState<boolean>(false);
  const [gamesCopiesNumbersArray, setGamesCopiesNumbersArray] = useState<
    GameCopyNumber[]
  >([]);

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
      const existingGames = (games.filter(
        (game) => game !== undefined
      ) as IGameFromApi[]).map((game, i) => ({
        ...game,
        isPhysical: gamesFromSessionData[i].isPhysical,
      }));
      const formattedGames: IGameForOrder[] = formatGamesForUI({
        discounts,
        gameCreators,
        genres,
        usedDiscounts,
        usedGenres,
        games: existingGames,
        userAchievements,
      }).map((game, i) => ({
        ...game,
        isPhysical: gamesFromSessionData[i].isPhysical,
        dublicatesNumber: 1,
      }));

      setGamesCopiesNumbersArray(
        formattedGames
          .filter((game) => game.isPhysical)
          .map((game) => game.id)
          .map((gameId) => ({ copiesNumber: 1, gameId }))
      );

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
            gameError && setError({ ...error, games: gameError })
        )
      ),
    [games.length]
  );
  console.log(games);

  const unblockGames = useCallback(
    () =>
      Aigle.map(games, (game) =>
        unblockGame(game.id).then(
          ({ error: gameError }) =>
            gameError && setError({ ...error, games: gameError })
        )
      ),
    [games.length]
  );

  const submitHandler = async () => {
    setIsRequestSending(true);
    await unblockGames();
    const gamesIds = games
      .filter((game) => !game.isPhysical)
      .map((game) => +game.id);

    const physicalGamesCopiesIds = gamesCopiesNumbersArray
      .map((el) => new Array(el.copiesNumber).fill(el.gameId) as number[])
      .flat();

    const { order, error: orderError } = await postOrder({
      gamesIds,
      status: "pending",
      physicalGamesCopiesIds,
    });

    if (orderError) {
      setError({ ...error, orders: orderError });
      await blockGames();
    } else {
      setGames([]);
      setCartData([]);
      const orderForUI = { ...order, orderedGames: games };
      history.push("/cart/success", orderForUI);
    }
    setIsRequestSending(false);
  };

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
        }) *
          (gamesCopiesNumbersArray.filter((el) => el.gameId === curr.id)[0]
            ?.copiesNumber || 1),
      0
    )
    .toFixed(2);

  useEffect(() => {
    error.orders &&
      showPopup({
        msg:
          error.orders.msg ||
          "Error occured while submitting order. Please try again",
        type: "error",
        code: error.orders.status,
      });
  }, [error.orders]);
  console.log(games[0]?.numberOfPhysicalCopies);

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

                <table className={styles.cartList}>
                  <tr className={`${styles.cartItem} ${styles.headerItem}`}>
                    <td className={`${styles.col} ${styles.name}`}>Name</td>
                    <td className={`${styles.col} ${styles.price}`}>Price</td>
                    <td className={`${styles.col} ${styles.numberOfCopies}`}>
                      Number of copies
                    </td>
                    <td className={`${styles.col} ${styles.action}`}></td>
                  </tr>
                  {games.map((game) => (
                    <tr className={styles.cartItem} key={game.id}>
                      <td
                        className={`${styles.col} ${styles.name}`}
                        onClick={() => history.push(`/store/item/${game.id}`)}
                      >
                        {game.name}
                        {game.isPhysical && (
                          <span className={styles.accent}>Physical copy</span>
                        )}
                      </td>
                      <td className={`${styles.col} ${styles.price}`}>
                        {getOptimalGamePrice({
                          achievementDiscount,
                          game,
                          isPhysical: game.isPhysical,
                        })}
                        $
                      </td>
                      <td className={`${styles.col} ${styles.numberOfCopies}`}>
                        {game.isPhysical ? (
                          <Counter
                            minValue={1}
                            maxValue={+game.numberOfPhysicalCopies + 1}
                            value={
                              gamesCopiesNumbersArray.filter(
                                (el) => el.gameId === game.id
                              )[0]?.copiesNumber || 0
                            }
                            handleValueChange={(value) =>
                              setGamesCopiesNumbersArray([
                                ...gamesCopiesNumbersArray.map((el) => {
                                  return el.gameId === game.id
                                    ? { ...el, copiesNumber: value }
                                    : el;
                                }),
                              ])
                            }
                          />
                        ) : (
                          <span className={styles.notPermitted}>
                            Only for physical copies
                          </span>
                        )}
                      </td>
                      <td className={`${styles.col} ${styles.action}`}>
                        <button
                          className={styles.btn}
                          onClick={() =>
                            removeCartItemHandler(game.id, game.isPhysical)
                          }
                        >
                          <FaTimes size={"100%"} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
              <div
                className={`${styles.totalBlockContainer} ${
                  isRequestSending && styles.sending
                }`}
              >
                <h2 className={styles.header}>Total</h2>
                <p className={styles.totalPrice}>
                  <span>Sub-total</span>
                  <span className={styles.price}>{totalPrice}$</span>
                </p>
                <div className={styles.actionsBlock}>
                  <button
                    className={`${styles.btn} ${styles.submitBtn} ${
                      isRequestSending && styles.blocked
                    }`}
                    onClick={() => !isRequestSending && submitHandler()}
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
