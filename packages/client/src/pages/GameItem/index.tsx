import React, { useEffect, useState } from "react";
import { Header } from "components/Header";
import styles from "./styles.module.scss";
import { useParams, useHistory } from "react-router-dom";
import { useApi } from "context/api";
import { IApiError, IDiscount, IGame, IGameCreator } from "interfaces/api";
import moment from "moment";
import { IGameForUI } from "interfaces/app";
import { Loader } from "components/Loader";
import { getUserSessionData, setUserSessionData } from "utils/helpers";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "context/auth";

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
  } = useApi();
  const [error, setError] = useState<IApiError | null>(null);
  const [game, setGame] = useState<IGameForUI | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionData, setSessionData] = useState<number[]>([]);

  const addToCartHandler = () => {
    if (game && token) {
      const sessionData = [...new Set([...getUserSessionData(), game.id])];
      setUserSessionData(sessionData);
      setSessionData(sessionData);
    } else history.push("/login");
  };

  useEffect(() => {
    setIsLoading(true);
    if (isNaN(id as any)) history.push("/store");
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

      const usedGenresIds = [
        ...new Set(
          usedGenres
            .filter((el) => el.gameId === game?.id)
            .map((el) => el.genreId)
        ),
      ];

      const gameGenres = genres.filter((genre) =>
        usedGenresIds.includes(genre.id)
      );

      const gameDiscountsIds = usedDiscounts
        .filter((el) => el.gameId === game?.id)
        .map((el) => el.discountId);

      const gameHightestDiscount = discounts
        .filter((el) => gameDiscountsIds.includes(el.id))
        .reduce(
          (prev, curr) => (prev.amount > curr.amount ? prev : curr),
          {} as IDiscount
        );
      setGame({
        ...(game as IGame),
        gameCreator: gameCreator as IGameCreator,
        genres: gameGenres,
        discount: gameHightestDiscount.amount ? gameHightestDiscount : null,
      } as IGameForUI);
      setIsLoading(false);
    };
    processGame();
  }, [id, sessionData.length]);

  return (
    <>
      <Header />
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      ) : (
        <div className={styles.gameItemContainer}>
          <div className={styles.gameItemContent}>
            <div className={styles.gameInfoBlock}>
              <div className={styles.gameLogo}></div>
              <div className={styles.gameInfoContent}>
                <h2 className={styles.name}>{game?.name}</h2>
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
                      {moment(game?.creationDate).format("DD-MM-YYYY")}
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
              <div className={styles.priceBlock}>
                {game?.discount && (
                  <>
                    <span className={styles.saleSize}>
                      {`-${game.discount.amount}%`}
                    </span>
                    <span className={styles.previousPrice}>{game.price} $</span>
                  </>
                )}

                <span className={styles.currentPrice}>
                  {Math.trunc(
                    (game?.price as number) *
                      (game?.discount ? (100 - game.discount.amount) / 100 : 1)
                  )}
                  $
                </span>
              </div>
              <div className={styles.buttonsBlock}>
                <button
                  className={`${styles.actionBtn} ${
                    game &&
                    getUserSessionData().includes(game.id) &&
                    styles.active
                  }`}
                  onClick={() => addToCartHandler()}
                >
                  {game && getUserSessionData().includes(game.id)
                    ? "Already in cart"
                    : "Add to cart"}
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
