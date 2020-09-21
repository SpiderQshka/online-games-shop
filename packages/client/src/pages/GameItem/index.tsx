import React, { useEffect, useState } from "react";
import { Header } from "components/Header";
import styles from "./styles.module.scss";
import { useParams, useHistory } from "react-router-dom";
import { useApi } from "context/api";
import { IApiError, IGame, IGameCreator, IGenre } from "interfaces/api";

interface GameItemProps {}

interface IGameForGameItem {
  id: number;
  name: string;
  logo: string;
  description: string;
  ageRating: number;
  price: number;
  numberOfPhysicalCopies: number;
  gameCreator: IGameCreator;
  creationDate: string;
  genres: IGenre[];
}

export const GameItem: React.FunctionComponent<GameItemProps> = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { getGame, getUsedGenres, getGenres, getGameCreator } = useApi();
  const [error, setError] = useState<IApiError | null>(null);
  const [game, setGame] = useState<IGameForGameItem | null>(null);
  console.log(game);
  useEffect(() => {
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

      setGame({
        ...(game as IGame),
        gameCreator: gameCreator as IGameCreator,
        genres: gameGenres,
      });
    };
    processGame();
  });
  return (
    <>
      <Header />
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
                    {game?.creationDate}
                  </span>
                </li>
                <li className={styles.gameInfoItem}>
                  <span className={styles.fieldName}>Genres</span>
                  <span className={styles.fieldValue}>
                    {game?.genres[0].name}
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
            <button className={styles.actionBtn}>Buy now</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameItem;
