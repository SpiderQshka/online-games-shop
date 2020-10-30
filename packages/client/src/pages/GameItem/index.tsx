import React, { useCallback, useEffect, useState } from "react";
import { Header } from "components/Header";
import styles from "./styles.module.scss";
import { useParams, useHistory } from "react-router-dom";
import { useApi } from "context/api";
import {
  IApiError,
  IGameCreatorFromApi,
  IGameFromApi,
  IMyGameFromApi,
} from "interfaces/api";
import moment from "moment";
import { IGameForUI } from "interfaces/app";
import { Loader } from "components/Loader";
import { getCartData, setCartData, formatGamesForUI } from "utils/helpers";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "context/auth";
import { isInteger, uniq } from "lodash";
import { usePopup } from "context/popup";

interface GameItemProps {}

export const GameItem: React.FunctionComponent<GameItemProps> = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
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
  const { showPopup } = usePopup();
  const [error, setError] = useState<IApiError | null>(null);
  const [game, setGame] = useState<IGameForUI | null>(null);
  const [userGames, setUserGames] = useState<IMyGameFromApi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionData, setSessionData] = useState<
    { id: number; isPhysical: boolean }[]
  >([]);

  const addToCartHandler = useCallback(
    (isPhysical: boolean) => {
      if (game && token) {
        const games = uniq([...getCartData(), { id: game.id, isPhysical }]);

        setCartData(games);
        setSessionData(games);
        if (isPhysical)
          blockGame(game.id).then(({ game, error }) => {
            if (error) setError(error);
          });

        showPopup({
          msg: `You successfully ordeded "${game?.name}"!`,
          type: "success",
        });
      } else history.push("/login");
    },
    [game, token]
  );

  useEffect(() => {
    setIsLoading(true);
    if (!isInteger(+id)) history.push("/store");
    const processGame = async () => {
      const { game, error: gameError } = await getGame(id as any);
      if (gameError) setError(gameError);

      const { usedGenres, error: usedGenresError } = await getUsedGenres();
      if (usedGenresError) setError(usedGenresError);

      const { genres, error: genresError } = await getGenres();
      if (genresError) setError(genresError);

      const { gameCreator, error: gameCreatorError } = await getGameCreator(
        game?.gameCreatorId as number
      );
      if (gameCreatorError) setError(gameCreatorError);

      const { discounts, error: discountsError } = await getDiscounts();
      if (discountsError) setError(discountsError);

      const {
        usedDiscounts,
        error: usedDiscountsError,
      } = await getUsedDiscounts();
      if (usedDiscountsError) setError(usedDiscountsError);

      const {
        achievements: userAchievements,
        error: userAchievementsError,
      } = await getUserAchievements();
      if (userAchievementsError) setError(userAchievementsError);

      const { games: userGames, error: userGamesError } = await getUserGames();
      if (userGamesError) setError(userGamesError);

      const gameForUI = formatGamesForUI({
        games: game ? [game as IGameFromApi] : [],
        discounts,
        usedDiscounts,
        userAchievements,
        gameCreators: gameCreator ? [gameCreator as IGameCreatorFromApi] : [],
        genres,
        usedGenres,
      })[0];

      setGame(gameForUI);
      setUserGames(userGames);
      setIsLoading(false);
    };
    processGame();
  }, [id, sessionData.length]);

  const isGameInCart =
    game &&
    getCartData()
      .map((game) => game.id)
      .includes(game.id);

  const isDigitalCopyBought =
    userGames
      .filter((userGame) => userGame.id === game?.id)
      .filter((userGame) => !userGame.isPhysical).length !== 0;
  const isPhysicalCopyBought =
    userGames
      .filter((userGame) => userGame.id === game?.id)
      .filter((userGame) => userGame.isPhysical).length !== 0;

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

  useEffect(() => {
    if (error && error.status !== 401) history.push("/error", error);
  }, []);

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
                      {game?.gameCreator.name}
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
                    <span className={styles.fieldValue}>{game?.ageRating}</span>
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
                  Digital ({game?.optimalPrice}$)
                  <span className={styles.msg}>
                    <FaShoppingCart size="15px" />
                  </span>
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.physical} ${
                    isGameInCart && styles.active
                  } ${isCopyPhysical && styles.inCart} ${
                    isPhysicalCopyBought && styles.bought
                  }`}
                  onClick={() =>
                    !isCopyPhysical &&
                    !isPhysicalCopyBought &&
                    addToCartHandler(true)
                  }
                >
                  Physical ({game?.physicalCopyOptimalPrice}$)
                  <span className={styles.msg}>
                    <FaShoppingCart size="15px" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameItem;
