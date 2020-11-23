import { SliderRange } from "components/SliderRange";
import { IApiError, IGameCreatorFromApi, IGenreFromApi } from "interfaces/api";
import React, { useState } from "react";
import { FaArrowLeft, FaWindowClose } from "react-icons/fa";
import { IFilterConfig } from "..";
import styles from "./styles.module.scss";

interface FiltersContainerProps {
  isFiltersMenuOpen: boolean;
  filterConfig: IFilterConfig;
  removeFilters: () => void;
  hightestGamePrice: number;
  setFilterConfig: (config: IFilterConfig) => void;
  isLoading: boolean;
  error: IApiError | null;
  genres: IGenreFromApi[];
  gameCreators: IGameCreatorFromApi[];
}

export const FiltersContainer: React.FunctionComponent<FiltersContainerProps> = ({
  filterConfig,
  isFiltersMenuOpen,
  removeFilters,
  hightestGamePrice,
  setFilterConfig,
  isLoading,
  error,
  genres,
  gameCreators,
}) => {
  const areFiltersActive =
    filterConfig.gameCreatorId ||
    filterConfig.genresIds.length > 0 ||
    filterConfig.priceBounds.min !== 0 ||
    filterConfig.priceBounds.max !== hightestGamePrice;

  const [openFilters, setOpenFilters] = useState<{
    genres: boolean;
    gameCreators: boolean;
  }>({ gameCreators: false, genres: false });

  return (
    <aside
      className={`${styles.filtersContainer} ${
        isFiltersMenuOpen && styles.open
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <h5 className={`${styles.header} ${areFiltersActive && styles.active}`}>
        Filters
        <span className={styles.closeIcon} onClick={removeFilters}>
          <FaWindowClose />
        </span>
      </h5>
      <form className={styles.filtersForm}>
        <h4 className={styles.inputGroupHeader}>Price</h4>
        <div className={styles.sliderRangeContainer}>
          <SliderRange
            max={hightestGamePrice}
            min={0}
            bounds={{
              upperBound: filterConfig.priceBounds.max,
              lowerBound: filterConfig.priceBounds.min,
            }}
            handleChange={({ lowerBound: min, upperBound: max }) => {
              setFilterConfig({
                ...filterConfig,
                priceBounds: { min, max },
              });
            }}
          />
        </div>
        <h4
          className={`${styles.inputGroupHeader} ${
            openFilters.genres && styles.active
          }`}
          style={{ marginTop: "10px" }}
          onClick={() =>
            setOpenFilters({
              ...openFilters,
              genres: !openFilters.genres,
            })
          }
        >
          Genres
          <FaArrowLeft className={styles.icon} size="20px" />
        </h4>
        <ul
          className={`${styles.inputGroup} ${
            openFilters.genres && styles.active
          }`}
        >
          {isLoading ? (
            <li
              className={`${styles.inputGroupItem} ${
                error ? styles.errorItem : styles.loadingItem
              }`}
            >
              Loading...
            </li>
          ) : (
            genres.map((genre) => (
              <li className={styles.inputGroupItem} key={genre.id}>
                <label
                  className={`${styles.label} ${
                    filterConfig.genresIds.includes(genre.id) && styles.active
                  }`}
                >
                  <input
                    key={genre.id}
                    type="checkbox"
                    name="genresIds"
                    value={genre.id}
                    checked={filterConfig.genresIds.includes(genre.id)}
                    className={`${styles.input}`}
                    tabIndex={1}
                    onClick={(e) => {
                      const input = e.target as HTMLInputElement;
                      if (input.checked)
                        setFilterConfig({
                          ...filterConfig,
                          genresIds: [...filterConfig.genresIds, genre.id],
                        });
                      else
                        setFilterConfig({
                          ...filterConfig,
                          genresIds: [
                            ...filterConfig.genresIds.filter(
                              (id) => genre.id !== id
                            ),
                          ],
                        });
                    }}
                  />
                  {genre.name}
                </label>
              </li>
            ))
          )}
        </ul>
        <h4
          className={`${styles.inputGroupHeader} ${
            openFilters.gameCreators && styles.active
          }`}
          onClick={() =>
            setOpenFilters({
              ...openFilters,
              gameCreators: !openFilters.gameCreators,
            })
          }
        >
          Game creators
          <FaArrowLeft className={styles.icon} size="20px" />
        </h4>
        <ul
          className={`${styles.inputGroup} ${
            openFilters.gameCreators && styles.active
          }`}
        >
          {isLoading ? (
            <li
              className={`${styles.inputGroupItem} ${
                error ? styles.errorItem : styles.loadingItem
              }`}
            >
              Loading...
            </li>
          ) : (
            gameCreators.map((gameCreator) => (
              <li className={styles.inputGroupItem} key={gameCreator.id}>
                <label
                  className={`${styles.label} ${
                    filterConfig.gameCreatorId === gameCreator.id &&
                    styles.active
                  }`}
                >
                  <input
                    key={gameCreator.id}
                    type="radio"
                    name="gameCreatorId"
                    value={gameCreator.id}
                    className={styles.input}
                    tabIndex={1}
                    checked={filterConfig.gameCreatorId === gameCreator.id}
                    onClick={(e) => {
                      const input = e.target as HTMLInputElement;
                      setFilterConfig({
                        ...filterConfig,
                        gameCreatorId: input.checked ? gameCreator.id : null,
                      });
                    }}
                  />
                  {gameCreator.name}
                </label>
              </li>
            ))
          )}
        </ul>
      </form>
    </aside>
  );
};
