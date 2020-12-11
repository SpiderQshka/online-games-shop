import React, { useCallback, useEffect, useState } from "react";
import { Header } from "components/Header";
import styles from "./styles.module.scss";
import { useParams, useHistory } from "react-router-dom";
import { useApi } from "context/api";
import {
  IGameCreatorFromApi,
  IGameFromApi,
  IMyGameFromApi,
} from "interfaces/api";
import moment from "moment";
import { defaultErrorObj, IErrorObject, IGameForUI } from "interfaces/app";
import { Loader } from "components/Loader";
import { getCartData, setCartData, formatGamesForUI } from "utils/helpers";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "context/auth";
import { isInteger, uniq } from "lodash";
import { Error } from "components/Error";
import { usePopup } from "context/popup";

export const GameItem: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const { showPopup } = usePopup();
  const history = useHistory();
  const {
    getGame,
    getUsedGenres,
    getGenres,
    getGameCreator,
    getDiscounts,
    getUsedDiscounts,
    blockGame,
    getUserAchievements,
    getUserGames,
  } = useApi();
  const [error, setError] = useState<IErrorObject>(defaultErrorObj);
  const [game, setGame] = useState<IGameForUI | null>(null);
  const [userGames, setUserGames] = useState<IMyGameFromApi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const addToCartHandler = useCallback(
    async (isPhysical: boolean) => {
      if (game && token) {
        const errorObj = { ...defaultErrorObj } as IErrorObject;

        const games = uniq([...getCartData(), { id: game.id, isPhysical }]);

        if (isPhysical) {
          const { error } = await blockGame(game.id);
          if (error) errorObj.games = error;
          else {
            setCartData(games);
          }
        } else {
          setCartData(games);
        }
        if (!errorObj.games)
          showPopup({
            msg: `Yea! You've ordered this game!`,
            type: "success",
          });
        else {
          showPopup({
            msg: errorObj.games.msg,
            type: "error",
            code: errorObj.games.status,
          });
        }
      } else history.push("/login");
    },
    [game, token]
  );

  useEffect(() => {
    setIsLoading(true);
    if (!isInteger(+id)) history.push("/store");
    const processGame = async () => {
      const errorObj = { ...defaultErrorObj } as IErrorObject;

      const { game, error: gameError } = await getGame(id as any);
      if (gameError) errorObj.games = gameError;

      const { usedGenres, error: usedGenresError } = await getUsedGenres();
      if (usedGenresError) errorObj.usedGenres = usedGenresError;

      const { genres, error: genresError } = await getGenres();
      if (genresError) errorObj.genres = genresError;

      const { gameCreator, error: gameCreatorError } = await getGameCreator(
        game?.gameCreatorId as number
      );
      if (gameCreatorError) errorObj.gameCreators = gameCreatorError;

      const { discounts, error: discountsError } = await getDiscounts();
      if (discountsError) errorObj.discounts = discountsError;

      const {
        usedDiscounts,
        error: usedDiscountsError,
      } = await getUsedDiscounts();
      if (usedDiscountsError) errorObj.usedDiscounts = usedDiscountsError;

      const {
        achievements: userAchievements,
        error: userAchievementsError,
      } = await getUserAchievements();
      if (userAchievementsError) errorObj.achievements = userAchievementsError;

      const { games: userGames, error: userGamesError } = await getUserGames();
      if (userGamesError) errorObj.users = userGamesError;

      const gameForUI =
        formatGamesForUI({
          games: game ? [game as IGameFromApi] : [],
          discounts,
          usedDiscounts,
          userAchievements,
          gameCreators: gameCreator ? [gameCreator as IGameCreatorFromApi] : [],
          genres,
          usedGenres,
        })[0] || null;

      setGame(gameForUI);
      setUserGames(userGames);
      setError(errorObj);
      setIsLoading(false);
    };
    processGame();
  }, [id]);

  const isGameInCart =
    game &&
    getCartData()
      .map((game) => game.id)
      .includes(game.id);

  const isDigitalCopyBought =
    userGames
      .filter((userGame) => userGame.id === game?.id)
      .filter((userGame) => !userGame.isPhysical).length !== 0;

  const isCopyPhysical =
    game &&
    getCartData()
      .filter((gameFromUserData) => gameFromUserData.id === game.id)
      .map((el) => el.isPhysical)
      .some((el) => el);

  const isCopyDigital =
    game &&
    getCartData()
      .filter((gameFromUserData) => gameFromUserData.id === game.id)
      .map((el) => el.isPhysical)
      .some((el) => !el);

  return (
    <>
      <Header />
      {isLoading ? (
        <div className={styles.container}>
          <Loader />
        </div>
      ) : (
        <div className={styles.gameItemContainer}>
          <div className={styles.gameItemContent}>
            {error.games && error.games.status !== 401 ? (
              <Error />
            ) : (
              <>
                <div className={styles.gameInfoBlock}>
                  <div
                    className={styles.gameLogo}
                    style={{ backgroundImage: `url(${game?.logo})` }}
                  ></div>
                  <h2 className={styles.gameName}>{game?.name}</h2>

                  <div className={styles.gameInfoContent}>
                    <ul className={styles.gameInfoList}>
                      <li className={styles.gameInfoItem}>
                        <span className={styles.fieldName}>Developer</span>
                        <span className={styles.fieldValue}>
                          {game?.gameCreator?.name}
                        </span>
                      </li>
                      <li className={styles.gameInfoItem}>
                        <span className={styles.fieldName}>Release date</span>
                        <span className={styles.fieldValue}>
                          {moment(game?.createdAt).format("DD-MM-YYYY")}
                        </span>
                      </li>
                      <li className={styles.gameInfoItem}>
                        <span className={styles.fieldName}>Genres</span>
                        <span className={styles.fieldValue}>
                          {game?.genres.map((genre, i) =>
                            i ? `, ${genre.name}` : genre.name
                          )}
                        </span>
                      </li>

                      <li className={styles.gameInfoItem}>
                        <span className={styles.fieldName}>Age rating</span>
                        <span className={styles.fieldValue}>
                          {game?.ageRating}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className={styles.gameDescriptionBlock}>
                  <h2 className={styles.header}>About a game</h2>
                  <p className={styles.description}>{game?.description}</p>
                </div>
                <div className={styles.actionsBlock}>
                  <div className={styles.buttonsBlock}>
                    <button
                      className={`${styles.actionBtn} ${styles.digital} ${
                        isGameInCart && styles.active
                      } ${isCopyDigital && styles.inCart} ${
                        isDigitalCopyBought && styles.bought
                      }`}
                      onClick={() =>
                        !isCopyDigital &&
                        !isDigitalCopyBought &&
                        addToCartHandler(false)
                      }
                    >
                      Digital (
                      {game?.optimalPrice !== 0
                        ? `${game?.optimalPrice}$`
                        : "Free"}
                      )
                      <span className={styles.msg}>
                        <FaShoppingCart size="15px" />
                      </span>
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.physical} ${
                        isGameInCart && styles.active
                      } ${isCopyPhysical && styles.inCart} ${
                        +(game?.numberOfPhysicalCopies || 0) <= 0 &&
                        styles.restricted
                      }`}
                      onClick={() =>
                        !isCopyPhysical &&
                        !(+(game?.numberOfPhysicalCopies || 0) <= 0) &&
                        addToCartHandler(true)
                      }
                    >
                      {+(game?.numberOfPhysicalCopies || 0) <= 0 ? (
                        "No physical copies left"
                      ) : (
                        <>
                          Physical (
                          {game?.physicalCopyOptimalPrice !== 0
                            ? `${game?.physicalCopyOptimalPrice}$`
                            : "Free"}
                          )
                        </>
                      )}

                      <span className={styles.msg}>
                        <FaShoppingCart size="15px" />
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GameItem;
