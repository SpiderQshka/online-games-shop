import { useApi } from "context/api";
import { IApiError, IDiscount, IGenre } from "interfaces/api";
import { IGameForUI } from "interfaces/app";
import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import styles from "./styles.module.scss";
import { config } from "config";

export const Dashboard = () => {
  const {
    getGames,
    getGameCreators,
    getUsedGenres,
    getDiscounts,
    getUsedDiscounts,
    getGenres,
    getOrders,
    getOrderedGames,
  } = useApi();
  const [error, setError] = useState<IApiError | null>(null);
  const [games, setGames] = useState<IGameForUI[]>([]);
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [gameCreators, setGameCreators] = useState<IGenre[]>([]);

  useEffect(() => {
    const processAsync = async () => {
      const { games, error: gamesError } = await getGames();
      if (gamesError) setError(gamesError);

      const {
        gameCreators,
        error: gameCreatorsError,
      } = await getGameCreators();
      if (gameCreatorsError) setError(gameCreatorsError);

      const { discounts, error: discountsError } = await getDiscounts();
      if (discountsError) setError(discountsError);

      const {
        usedDiscounts,
        error: usedDiscountsError,
      } = await getUsedDiscounts();
      if (usedDiscountsError) setError(usedDiscountsError);

      const { genres, error: genresError } = await getGenres();
      if (genresError) setError(genresError);

      const { usedGenres, error: useGenresError } = await getUsedGenres();
      if (useGenresError) setError(useGenresError);

      const { orders, error: ordersError } = await getOrders();
      if (ordersError) setError(ordersError);

      const {
        orderedGames,
        error: orderedGamesError,
      } = await getOrderedGames();
      if (orderedGamesError) setError(orderedGamesError);

      const gamesForUI = games.map((game) => {
        const gameCreator = gameCreators.filter(
          (el) => el.id === game.gameCreatorId
        )[0];
        const gameGenresIds = [
          ...new Set(
            usedGenres
              .filter((el) => el.gameId === game.id)
              .map((el) => el.genreId)
          ),
        ];
        const gameGenres = genres.filter((genre) =>
          gameGenresIds.includes(genre.id)
        );
        const gameDiscountsIds = usedDiscounts
          .filter((el) => el.gameId === game.id)
          .map((el) => el.discountId);
        const gameHightestDiscount = discounts
          .filter((el) => gameDiscountsIds.includes(el.id))
          .reduce(
            (prev, curr) => (prev.amount > curr.amount ? prev : curr),
            {} as IDiscount
          );
        return {
          ...game,
          gameCreator,
          genres: gameGenres,
          discount: gameHightestDiscount.amount ? gameHightestDiscount : null,
        };
      });
      setGames(gamesForUI);
      setGenres(genres);
      setGameCreators(gameCreators);
    };
    processAsync();
  }, []);
  return (
    <div className={styles.dashboardContent}>
      <h2 className={styles.header}>Dashboard</h2>
      <div className={styles.diagramsBlock}>
        <div className={`${styles.diagramContainer} ${styles.first}`}>
          <h3 className={styles.header}>The most expensive games</h3>
          <div className={styles.diagramContent}>
            <PieChart
              className={`${styles.diagram}`}
              label={({ dataEntry }) => dataEntry.value}
              lineWidth={20}
              paddingAngle={18}
              rounded
              labelStyle={{
                fontSize: "3px",
                fontFamily: "sans-serif",
                fill: "#fff",
              }}
              data={games.map((game, i) => ({
                title: game.name,
                value: +game.price,
                color: config.colors[i],
              }))}
            />
          </div>
        </div>
        <div className={`${styles.diagramContainer} ${styles.second}`}>
          <h3 className={styles.header}>The most popular genres</h3>
          <div className={styles.diagramContent}>
            <PieChart
              className={`${styles.diagram}`}
              label={({ dataEntry }) => dataEntry.title}
              labelStyle={{
                fontSize: "9px",
                fontFamily: "sans-serif",
              }}
              data={genres.map((genre, i) => {
                const value = games.reduce(
                  (prev, curr) =>
                    curr.genres.map((genre) => genre.id).includes(genre.id)
                      ? ++prev
                      : prev,
                  0
                );

                return {
                  title: genre.name,
                  color: config.colors[i],
                  value,
                };
              })}
            />
          </div>
        </div>
        <div className={`${styles.diagramContainer} ${styles.third}`}>
          <h3 className={styles.header}>The most productive game creators</h3>
          <div className={styles.diagramContent}>
            <PieChart
              className={`${styles.diagram}`}
              label={({ dataEntry }) => dataEntry.title}
              labelStyle={{
                fontSize: "7px",
                fontFamily: "sans-serif",
              }}
              data={gameCreators.map((gameCreator, i) => {
                const value = games.reduce(
                  (prev, curr) =>
                    gameCreator.id === curr.gameCreator.id ? ++prev : prev,
                  0
                );
                return {
                  title: gameCreator.name,
                  color: config.colors[i],
                  value,
                };
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
