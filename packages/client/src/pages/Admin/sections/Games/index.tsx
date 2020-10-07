import { IGameForUI } from "interfaces/app";
import React from "react";
import { useHistory } from "react-router-dom";
import styles from "components/AdminTable/styles.module.scss";
import { FaPlus } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import moment from "moment";

interface OrdersProps {
  games: IGameForUI[];
}

export const Games: React.FunctionComponent<OrdersProps> = ({ games }) => {
  const history = useHistory();

  return (
    <div className={styles.itemsContent}>
      <h2 className={styles.header}>Games</h2>
      <table className={styles.itemsTable}>
        <tr className={`${styles.row} ${styles.headerRow}`}>
          <th className={styles.col}>ID</th>
          <th className={styles.col}>Name</th>
          <th className={styles.col}>Logo</th>
          <th className={styles.col}>Creation date</th>
          <th className={styles.col}>Game creator</th>
          <th className={styles.col}>Description</th>
          <th className={styles.col}>Age rating</th>
          <th className={styles.col}>Genres</th>
          <th className={styles.col}>Price</th>
          <th
            className={`${styles.col} ${styles.btnContainer}`}
            onClick={() => history.push("/admin/games/create")}
          >
            <button className={styles.btn}>
              <FaPlus size="25px" />
            </button>
          </th>
        </tr>
        {games
          .sort((a, b) => a.id - b.id)
          .map((game) => (
            <tr className={styles.row} key={game.id}>
              <td className={styles.col}>{game.id}</td>
              <td className={styles.col}>{game.name}</td>
              <td className={`${styles.col} ${styles.imgContainer}`}>
                <div
                  className={styles.img}
                  style={{ backgroundImage: `url(${game.logo})` }}
                ></div>
              </td>
              <td className={styles.col}>
                {moment(game.createdAt).format("DD-MM-YYYY")}
              </td>
              <td className={styles.col}>{game.gameCreator.name}</td>
              <td className={`${styles.col} ${styles.largeText}`}>
                {game.description}
              </td>
              <td className={styles.col}>{game.ageRating}</td>
              <td className={`${styles.col} ${styles.list}`}>
                {game.genres.map((genre) => (
                  <li key={genre.id} className={styles.listItem}>
                    {genre.name}
                  </li>
                ))}
              </td>
              <td className={styles.col}>{game.price}</td>
              <td className={`${styles.col} ${styles.btnContainer}`}>
                <button
                  className={styles.btn}
                  onClick={() => history.push(`/admin/games/${game.id}`)}
                >
                  <BsThreeDots size="25px" />
                </button>
              </td>
            </tr>
          ))}
      </table>
    </div>
  );
};
