import { IGameCreatorFromApi, IGenreFromApi } from "interfaces/api";
import { IGameForUI, IOrderWithUserId } from "interfaces/app";
import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import styles from "./styles.module.scss";
import { config } from "config";
import { BarChart } from "./BarChart";
interface DashboardProps {
  genres: IGenreFromApi[];
  games: IGameForUI[];
  gameCreators: IGameCreatorFromApi[];
  orders: IOrderWithUserId[];
}

export const Dashboard: React.FunctionComponent<DashboardProps> = ({
  games,
  genres,
  gameCreators,
  orders,
}) => {
  const labelConfig = {
    fontSize: "4px",
    fontFamily: "sans-serif",
    fill: "#fff",
  };
  const shiftSize = 0.5;

  const genresData = genres
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
        return { ...genre, color: config.colors.primary };
      return genre;
    })
    .filter((el) => el.value !== 0);

  return (
    <div className={styles.dashboardContent}>
      <h2 className={styles.header}>Dashboard</h2>
      <div className={styles.itemsBlock}>
        <div className={`${styles.itemContainer} ${styles.infoFirst}`}>
          <div className={`${styles.itemContent}`}>
            <p className={styles.value}>{orders.length}</p>
            <p className={styles.description}>Total orders</p>
          </div>
        </div>
        <div className={`${styles.itemContainer} ${styles.infoSecond}`}>
          <div className={`${styles.itemContent}`}>
            <p className={styles.value}>{games.length}</p>
            <p className={styles.description}>Total games</p>
          </div>
        </div>
        <div className={`${styles.itemContainer} ${styles.infoThird}`}>
          <div className={`${styles.itemContent}`}>
            <p className={styles.value}>{gameCreators.length}</p>
            <p className={styles.description}>Total game creators</p>
          </div>
        </div>
        <div className={`${styles.itemContainer} ${styles.barChart}`}>
          <h3 className={styles.header}>The most expensive games</h3>
          <div className={`${styles.itemContent}`}>
            <BarChart
              data={games.map((game) => ({
                name: game.name,
                price: game.price,
              }))}
            />
          </div>
        </div>
        <div className={`${styles.itemContainer} ${styles.pieChart}`}>
          <h3 className={styles.header}>The most popular genres</h3>
          <div className={styles.itemContent}>
            <PieChart
              className={`${styles.diagram}`}
              radius={PieChart.defaultProps.radius - shiftSize}
              segmentsShift={() => shiftSize}
              label={({ dataEntry }) => dataEntry.title}
              labelStyle={labelConfig}
              data={genresData}
              labelPosition={90}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
