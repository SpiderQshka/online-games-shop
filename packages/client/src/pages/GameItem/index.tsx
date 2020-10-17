import React, { useCallback, useEffect, useState } from "react";
import { Header } from "components/Header";
import styles from "./styles.module.scss";
import { useParams, useHistory } from "react-router-dom";
import { useApi } from "context/api";
import {
  IApiError,
  IDiscountFromApi,
  IGameCreatorFromApi,
} from "interfaces/api";
import moment from "moment";
import { IGameForUI } from "interfaces/app";
import { Loader } from "components/Loader";
import { getUserSessionData, setUserSessionData } from "utils/helpers";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "context/auth";
import { isInteger, uniq } from "lodash";

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
  } = useApi();
  const [error, setError] = useState<IApiError | null>(null);
  const [game, setGame] = useState<IGameForUI | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionData, setSessionData] = useState<
    { id: number; isPhysical: boolean }[]
  >([]);

  const addToCartHandler = useCallback(
    (isPhysical: boolean) => {
      if (game && token) {
        const games = uniq([
          ...getUserSessionData(),
          { id: game.id, isPhysical },
        ]);

        setUserSessionData(games);
        setSessionData(games);
        if (isPhysical)
          blockGame(game.id).then(({ game, error }) => {
            if (error) setError(error);
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

      const gameHightestDiscount = game
        ? discounts
            .filter((el) => gameDiscountsIds.includes(el.id))
            .reduce((prev, curr) => {
              const prevDisountInPercents =
                prev.type === "%"
                  ? prev.amount
                  : ((game.price - (game.price - prev.amount)) / game.price) *
                    100;
              const currDisountInPercents =
                curr.type === "%"
                  ? curr.amount
                  : ((game.price - (game.price - curr.amount)) / game.price) *
                    100;

              return prevDisountInPercents > currDisountInPercents
                ? prev
                : curr;
            }, {} as IDiscountFromApi)
        : null;

      setGame({
        ...game,
        gameCreator: gameCreator as IGameCreatorFromApi,
        genres: gameGenres,
        discount:
          gameHightestDiscount && gameHightestDiscount.amount
            ? gameHightestDiscount
            : null,
      } as IGameForUI);
      setIsLoading(false);
    };
    processGame();
  }, [id, sessionData.length]);

  const isGameInCart =
    game &&
    getUserSessionData()
      .map((game) => game.id)
      .includes(game.id);

  const isCopyPhysical =
    game &&
    getUserSessionData()
      .filter((gameFromUserData) => gameFromUserData.id === game.id)
      .map((el) => el.isPhysical)
      .some((el) => el);

  const isCopyDigital =
    game &&
    getUserSessionData()
      .filter((gameFromUserData) => gameFromUserData.id === game.id)
      .map((el) => el.isPhysical)
      .some((el) => !el);

  const gamePriceWithDiscount =
    game &&
    (game.discount
      ? game.discount.type === "%"
        ? Math.trunc(
            game.price *
              (game.discount ? (100 - game.discount.amount) / 100 : 1)
          )
        : Math.trunc(game.price - game.discount.amount)
      : game.price);

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
              <div className={styles.priceBlock}>
                {game?.discount && (
                  <>
                    <span className={styles.saleSize}>
                      {`-${game.discount.amount}${game.discount.type}`}
                    </span>
                    {/* <span className={styles.previousPrice}>{game.price}$</span> */}
                  </>
                )}

                {/* <span className={styles.currentPrice}>
                  {gamePriceWithDiscount}$
                </span> */}
              </div>
              <div className={styles.buttonsBlock}>
                <button
                  className={`${styles.actionBtn} ${styles.digital} ${
                    isGameInCart && styles.active
                  } ${isCopyDigital && styles.inCart}`}
                  onClick={() => !isCopyDigital && addToCartHandler(false)}
                >
                  Digital ({gamePriceWithDiscount}$)
                  <span className={styles.msg}>
                    <FaShoppingCart size="15px" />
                  </span>
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.physical} ${
                    isGameInCart && styles.active
                  } ${isCopyPhysical && styles.inCart}`}
                  onClick={() => !isCopyPhysical && addToCartHandler(true)}
                >
                  Physical ({game?.physicalCopyPrice}$)
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
