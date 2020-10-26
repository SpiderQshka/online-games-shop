import { Header } from "components/Header";
import { useApi } from "context/api";
import { IApiError, IGameCreatorFromApi, IGenreFromApi } from "interfaces/api";
import { IGameForUI } from "interfaces/app";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  getOptimalGamePrice,
  formatGamesForUI,
  getAchievementDiscountSize,
  getFilterOptions,
} from "utils/helpers";
import { filterGames, sortGames } from "utils/helpers";
import { FaWindowClose, FaSadTear, FaFilter } from "react-icons/fa";
import styles from "./styles.module.scss";
import { useHistory } from "react-router-dom";
import { Loader } from "components/Loader";
import { usePopup } from "context/popup";

export type SortType = "creationDate" | "alphabet" | "discount";

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

  const history = useHistory();
  const formRef = useRef(null);
  const { showPopup, isOpen } = usePopup();

  const [games, setGames] = useState<IGameForUI[]>([]);
  const [gameCreators, setGameCreators] = useState<IGameCreatorFromApi[]>([]);
  const [genres, setGenres] = useState<IGenreFromApi[]>([]);

  const [error, setError] = useState<IApiError | null>(null);
  const [sortType, setSortType] = useState<SortType>("alphabet");
  const [filtersAmount, setFiltersAmount] = useState<number>(0);
  const [filteredGames, setFilteredGames] = useState<IGameForUI[]>([]);
  const [isFiltersMenuOpen, setIsFiltersMenuOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [achievementDiscount, setAchievementDiscount] = useState<number>(0);

  const removeFilters = useCallback(() => {
    if (formRef.current) {
      const form = (formRef.current as any) as HTMLFormElement;
      const formInputs = [...form.elements] as HTMLInputElement[];
      formInputs.forEach((input) => input.checked && (input.checked = false));
    }
    setFilteredGames(sortGames(games, sortType));
    setFiltersAmount(0);
  }, [formRef.current, games, sortType]);

  const handleFilterTypeChange = useCallback(
    (e: React.FormEvent) => {
      const form = e.currentTarget as HTMLFormElement;
      const formInputs = [...form.elements] as HTMLInputElement[];
      const checkedFormInputs = formInputs.filter((input) => input.checked);

      if (checkedFormInputs.length) {
        const filterOptions = getFilterOptions(checkedFormInputs);
        setFilteredGames(
          sortGames(filterGames(games, filterOptions), sortType)
        );
        setFiltersAmount(checkedFormInputs.length);
      } else removeFilters();
    },
    [games, sortType]
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
                <span className={styles.text}>Sort by</span>
                <select
                  name="sortBy"
                  className={styles.sortBySelect}
                  onChange={(e) => setSortType(e.target.value as SortType)}
                  value={sortType}
                >
                  <option value="creationDate" className={styles.sortByItem}>
                    Creation date
                  </option>
                  <option value="alphabet" className={styles.sortByItem}>
                    Alphabet
                  </option>
                  <option value="discount" className={styles.sortByItem}>
                    Discount
                  </option>
                </select>
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
                        {getOptimalGamePrice({ achievementDiscount, game })}$
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
              className={`${styles.header} ${!!filtersAmount && styles.active}`}
            >
              Filters
              <span className={styles.filtersAmount}>
                {!!filtersAmount && filtersAmount}
              </span>
              <span className={styles.closeIcon} onClick={removeFilters}>
                <FaWindowClose />
              </span>
            </h5>
            <form
              className={styles.filtersForm}
              onChange={handleFilterTypeChange}
              ref={formRef}
            >
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
                          className={styles.input}
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
