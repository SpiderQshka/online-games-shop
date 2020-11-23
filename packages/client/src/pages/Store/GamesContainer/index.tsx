import { Error } from "components/Error";
import { CenteredLoader } from "components/Loader";
import { Select } from "components/Select";
import { IApiError } from "interfaces/api";
import { IGameForUI } from "interfaces/app";
import React from "react";
import { FaFilter, FaSadTear } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { SortType } from "..";
import styles from "./styles.module.scss";

interface GamesListProps {
  filteredGames: IGameForUI[];
  achievementDiscount: number;
  error: IApiError | null;
  sortType: SortType;
  setSortType: (type: SortType) => void;
  setIsFiltersMenuOpen: (isOpen: boolean) => void;
  isLoading: boolean;
}

export const GamesContainer: React.FunctionComponent<GamesListProps> = ({
  achievementDiscount,
  filteredGames,
  error,
  setIsFiltersMenuOpen,
  setSortType,
  sortType,
  isLoading,
}) => {
  const history = useHistory();
  return (
    <div className={styles.gamesContainer}>
      <div className={styles.infoContainer}>
        <div className={styles.sortByContainer}>
          <p className={styles.text}>Sort by</p>
          <Select
            handleChange={(value) => setSortType(value as SortType)}
            selectedValue={sortType}
            valuesList={[
              { label: "Creation date", value: "creationDate" },
              { label: "Alphabet", value: "alphabet" },
              { label: "Discount", value: "discount" },
            ]}
          />
        </div>

        <button
          className={styles.openFiltersBtn}
          onClick={() => setIsFiltersMenuOpen(true)}
        >
          <span className={styles.text}>Filters</span>
          <FaFilter size="20px" />
        </button>
      </div>
      {isLoading ? (
        <CenteredLoader />
      ) : error ? (
        <Error />
      ) : filteredGames.length > 0 ? (
        <ul className={styles.gamesList}>
          {filteredGames.map((game) => (
            <li
              className={styles.gameItem}
              key={game.id}
              onClick={() => history.push(`/store/item/${game.id}`)}
            >
              <div
                className={styles.logoContainer}
                style={{ backgroundImage: `url(${game.logo})` }}
              ></div>
              <p className={styles.name}>{game.name}</p>
              <p className={styles.gameCreator}>{game.gameCreator?.name}</p>
              <div className={styles.priceBlock}>
                {game.optimalPrice !== 0 &&
                  (game.discount || achievementDiscount > 0) && (
                    <>
                      <span className={styles.saleSize}>
                        {`-${
                          game.discount
                            ? game.discount.amount
                            : achievementDiscount
                        }${game.discount ? game.discount.type : "%"}`}
                      </span>
                      <span className={styles.previousPrice}>
                        {game.price}$
                      </span>
                    </>
                  )}

                <span className={styles.currentPrice}>
                  {game.optimalPrice !== 0 ? `${game.optimalPrice}$` : "Free"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.notFoundBlock}>
          <h2 className={styles.header}>
            Can't find any games that fit your request
          </h2>
          <div className={styles.iconContainer}>
            <FaSadTear size="100%" />
          </div>
        </div>
      )}
    </div>
  );
};
