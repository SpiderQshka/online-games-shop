import React from "react";
import { useHistory } from "react-router-dom";
import styles from "components/AdminTable/styles.module.scss";
import { FaPlus } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { IGameCreatorFromApi } from "interfaces/api";

interface GameCreatorsProps {
  gameCreators: IGameCreatorFromApi[];
}

export const GameCreators: React.FunctionComponent<GameCreatorsProps> = ({
  gameCreators,
}) => {
  const history = useHistory();

  return (
    <div className={styles.itemsContent}>
      <h2 className={styles.header}>Game creators</h2>
      <table className={styles.itemsTable}>
        <tr className={`${styles.row} ${styles.headerRow}`}>
          <th className={styles.col}>ID</th>
          <th className={styles.col}>Name</th>
          <th className={styles.col}>Logo</th>
          <th className={styles.col}>Year of foundation</th>
          <th
            className={`${styles.col} ${styles.btnContainer}`}
            onClick={() => history.push("/admin/gameCreators/create")}
          >
            <button className={styles.btn}>
              <FaPlus size="25px" />
            </button>
          </th>
        </tr>
        {gameCreators
          .sort((a, b) => a.id - b.id)
          .map((gameCreator) => (
            <tr className={styles.row} key={gameCreator.id}>
              <td className={styles.col}>{gameCreator.id}</td>
              <td className={styles.col}>{gameCreator.name}</td>
              <td className={`${styles.col} ${styles.imgContainer}`}>
                <div
                  className={styles.img}
                  style={{ backgroundImage: `url(${gameCreator.logo})` }}
                ></div>
              </td>
              <td className={`${styles.col}`}>
                {gameCreator.yearOfFoundation}
              </td>
              <td className={`${styles.col} ${styles.btnContainer}`}>
                <button
                  className={styles.btn}
                  onClick={() =>
                    history.push(`/admin/gameCreators/${gameCreator.id}`)
                  }
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
