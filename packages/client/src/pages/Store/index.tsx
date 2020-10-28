import { Header } from "components/Header";
import { useApi } from "context/api";
import { IApiError, IGameCreatorFromApi, IGenreFromApi } from "interfaces/api";
import { IGameForUI } from "interfaces/app";
import React, { useCallback, useEffect, useState } from "react";
import { formatGamesForUI, getAchievementDiscountSize } from "utils/helpers";
import { filterGames, sortGames } from "utils/helpers";
import { FaWindowClose, FaSadTear, FaFilter } from "react-icons/fa";
import styles from "./styles.module.scss";
import { useHistory } from "react-router-dom";
import { Loader } from "components/Loader";
import { usePopup } from "context/popup";
import { Select } from "components/Select";
import { SliderRange } from "components/SliderRange";

export type SortType = "creationDate" | "alphabet" | "discount";
export interface IFilterConfig {
  genresIds: number[];
  gameCreatorId: number | null;
  priceBounds: {
    min: number;
    max: number;
  };
}

export const Store = () => {
  const {
    getGames,
    getGameCreators,
    getDiscounts,
    getUsedDiscounts,
    getGenres,
    getUsedGenres,
    getUserAchievements,
  } = useApi();
  const { showPopup } = usePopup();

  const history = useHistory();

  const [games, setGames] = useState<IGameForUI[]>([]);
  const [gameCreators, setGameCreators] = useState<IGameCreatorFromApi[]>([]);
  const [genres, setGenres] = useState<IGenreFromApi[]>([]);

  const [error, setError] = useState<IApiError | null>(null);
  const [sortType, setSortType] = useState<SortType>("alphabet");
  const [filteredGames, setFilteredGames] = useState<IGameForUI[]>([]);
  const [isFiltersMenuOpen, setIsFiltersMenuOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [achievementDiscount, setAchievementDiscount] = useState<number>(0);

  const [filterConfig, setFilterConfig] = useState<IFilterConfig>({
    gameCreatorId: null,
    genresIds: [],
    priceBounds: { min: 0, max: 0 },
  });

  const hightestGamePrice =
    games.length > 0
      ? games.map((game) => +game.optimalPrice).sort((a, b) => b - a)[0]
      : 0;

  const removeFilters = useCallback(() => {
    setFilterConfig({
      gameCreatorId: null,
      priceBounds: { min: 0, max: hightestGamePrice },
      genresIds: [],
    });
  }, [games, sortType, hightestGamePrice]);

  useEffect(
    () =>
      setFilteredGames(sortGames(filterGames(games, filterConfig), sortType)),
    [games, sortType, filterConfig]
  );

  useEffect(
    () =>
      setFilterConfig({
        ...filterConfig,
        priceBounds: { ...filterConfig.priceBounds, max: hightestGamePrice },
      }),
    [games.length]
  );

  useEffect(() => setFilteredGames(sortGames(filteredGames, sortType)), [
    sortType,
  ]);

  useEffect(() => {
    setIsLoading(true);
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

      const {
        achievements: userAchievements,
        error: userAchievementsError,
      } = await getUserAchievements();
      if (userAchievementsError) setError(userAchievementsError);

      const storeGames = formatGamesForUI({
        discounts,
        gameCreators,
        games,
        genres,
        usedDiscounts,
        usedGenres,
        userAchievements,
      });

      setAchievementDiscount(
        getAchievementDiscountSize({
          userAchievements,
        })
      );
      setGames(sortGames(storeGames, sortType));
      setFilteredGames(sortGames(storeGames, sortType));
      setGenres(genres);
      setGameCreators(gameCreators);
      setIsLoading(false);
    };
    processAsync();
  }, []);

  useEffect(() => {
    if (error) showPopup({ type: "error", msg: error.msg, code: error.status });
  }, [error]);

  const isFiltersActive =
    filterConfig.gameCreatorId ||
    filterConfig.genresIds.length > 0 ||
    filterConfig.priceBounds.min !== 0 ||
    filterConfig.priceBounds.max !== hightestGamePrice;

  return (
    <>
      <Header />
      <div className={styles.storeContainer}>
        <div
          className={`${styles.storeContent} ${
            isFiltersMenuOpen && styles.overlay
          }`}
          onClick={() => {
            isFiltersMenuOpen && setIsFiltersMenuOpen(false);
          }}
        >
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
            {isLoading || error ? (
              <div className={styles.loaderContainer}>
                <Loader />
              </div>
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
                    <p className={styles.gameCreator}>
                      {game.gameCreator.name}
                    </p>
                    <div className={styles.priceBlock}>
                      {(game.discount || achievementDiscount > 0) && (
                        <>
                          <span className={styles.saleSize}>
                            {`-${
                              game.discount
                                ? game.discount.amount
                                : achievementDiscount
                            }${game.discount ? game.discount.type : "%"}`}
                          </span>
                          <span className={styles.previousPrice}>
                            {game.price} $
                          </span>
                        </>
                      )}

                      <span className={styles.currentPrice}>
                        {game.optimalPrice}$
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
          <aside
            className={`${styles.filtersContainer} ${
              isFiltersMenuOpen && styles.open
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h5
              className={`${styles.header} ${isFiltersActive && styles.active}`}
            >
              Filters
              <span className={styles.closeIcon} onClick={removeFilters}>
                <FaWindowClose />
              </span>
            </h5>
            <form className={styles.filtersForm}>
              <h4 className={styles.inputGroupHeader}>Price</h4>
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
              <h4 className={styles.inputGroupHeader}>Genres</h4>
              <ul className={styles.inputGroup}>
                {isLoading || error ? (
                  <li
                    className={`${styles.inputGroupItem} ${styles.loadingItem}`}
                  >
                    Loading...
                  </li>
                ) : (
                  genres.map((genre) => (
                    <li className={styles.inputGroupItem} key={genre.id}>
                      <label className={styles.label}>
                        <input
                          key={genre.id}
                          type="checkbox"
                          name="genresIds"
                          value={genre.id}
                          checked={filterConfig.genresIds.includes(genre.id)}
                          className={styles.input}
                          onClick={(e) => {
                            const input = e.target as HTMLInputElement;
                            if (input.checked)
                              setFilterConfig({
                                ...filterConfig,
                                genresIds: [
                                  ...filterConfig.genresIds,
                                  genre.id,
                                ],
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
              <h4 className={styles.inputGroupHeader}>Game creators</h4>
              <ul className={styles.inputGroup}>
                {isLoading || error ? (
                  <li
                    className={`${styles.inputGroupItem} ${styles.loadingItem}`}
                  >
                    Loading...
                  </li>
                ) : (
                  gameCreators.map((gameCreator) => (
                    <li className={styles.inputGroupItem} key={gameCreator.id}>
                      <label className={styles.label}>
                        <input
                          key={gameCreator.id}
                          type="radio"
                          name="gameCreatorId"
                          value={gameCreator.id}
                          className={styles.input}
                          checked={
                            filterConfig.gameCreatorId === gameCreator.id
                          }
                          onClick={(e) => {
                            const input = e.target as HTMLInputElement;
                            setFilterConfig({
                              ...filterConfig,
                              gameCreatorId: input.checked
                                ? gameCreator.id
                                : null,
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
        </div>
      </div>
    </>
  );
};

export default Store;
