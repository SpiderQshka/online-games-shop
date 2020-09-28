import { IGameCreator, IGenre } from "interfaces/api";
import { IGameForUI } from "interfaces/app";
import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import styles from "./styles.module.scss";
import { config } from "config";

interface DashboardProps {
  genres: IGenre[];
  games: IGameForUI[];
  gameCreators: IGameCreator[];
}

export const Dashboard: React.FunctionComponent<DashboardProps> = ({
  games,
  genres,
  gameCreators,
}) => {
  const labelConfig = {
    fontSize: "9px",
    fontFamily: "sans-serif",
    fill: "#fff",
  };
  const shiftSize = 0.5;
  return (
    <div className={styles.dashboardContent}>
      <h2 className={styles.header}>Dashboard</h2>
      <div className={styles.diagramsBlock}>
        <div className={`${styles.diagramContainer} ${styles.first}`}>
          <h3 className={styles.header}>The most expensive games</h3>
          <div className={styles.diagramContent}>
            <PieChart
              radius={PieChart.defaultProps.radius - shiftSize}
              segmentsShift={() => shiftSize}
              className={`${styles.diagram}`}
              label={({ dataEntry }) => dataEntry.value}
              labelStyle={{
                ...labelConfig,
                fontSize: "5px",
              }}
              data={games.map((game, i) => ({
                title: game.name,
                value: +game.price,
                color:
                  games.reduce((prev, curr) =>
                    +prev.price < +curr.price ? curr : prev
                  ).id === game.id
                    ? config.colors.accent
                    : config.colors.primary,
              }))}
            />
          </div>
        </div>
        <div className={`${styles.diagramContainer} ${styles.second}`}>
          <h3 className={styles.header}>The most popular genres</h3>
          <div className={styles.diagramContent}>
            <PieChart
              className={`${styles.diagram}`}
              radius={PieChart.defaultProps.radius - shiftSize}
              segmentsShift={() => shiftSize}
              label={({ dataEntry }) => dataEntry.title}
              labelStyle={labelConfig}
              data={genres
                .map((genre) => {
                  const value = games.reduce(
                    (prev, curr) =>
                      curr.genres.map((genre) => genre.id).includes(genre.id)
                        ? ++prev
                        : prev,
                    0
                  );

                  return {
                    title: genre.name,
                    color: config.colors.primary,
                    value,
                  };
                })
                .map((genre, i, array) => {
                  const biggestValue = array.reduce((prev, curr) =>
                    prev.value > curr.value ? prev : curr
                  ).value;
                  if (biggestValue === genre.value)
                    return { ...genre, color: config.colors.accent };
                  return genre;
                })}
            />
          </div>
        </div>
        <div className={`${styles.diagramContainer} ${styles.third}`}>
          <h3 className={styles.header}>The most productive game creators</h3>
          <div className={styles.diagramContent}>
            <PieChart
              className={`${styles.diagram}`}
              radius={PieChart.defaultProps.radius - shiftSize}
              segmentsShift={() => shiftSize}
              label={({ dataEntry }) => dataEntry.title}
              labelStyle={labelConfig}
              data={gameCreators.map((gameCreator, i) => {
                const value = games.reduce(
                  (prev, curr) =>
                    gameCreator.id === curr.gameCreator.id ? ++prev : prev,
                  0
                );
                return {
                  title: gameCreator.name,
                  color: config.colors.primary,
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
