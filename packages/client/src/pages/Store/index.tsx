import { Header } from "components/Header";
import { useApi } from "context/api";
import {
  IGameCreatorFromApi,
  IGenreFromApi,
  IMyAchievementFromApi,
} from "interfaces/api";
import { defaultErrorObj, IErrorObject, IGameForUI } from "interfaces/app";
import React, { useCallback, useEffect, useState } from "react";
import {
  checkNewAchievements,
  formatGamesForUI,
  getAchievementDiscountSize,
} from "utils/helpers";
import { filterGames, sortGames } from "utils/helpers";
import styles from "./styles.module.scss";
import { usePopup } from "context/popup";
import { GamesContainer } from "./GamesContainer";
import { FiltersContainer } from "./FiltersContainer";

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
  const [games, setGames] = useState<IGameForUI[]>([]);
  const [gameCreators, setGameCreators] = useState<IGameCreatorFromApi[]>([]);
  const [genres, setGenres] = useState<IGenreFromApi[]>([]);

  const [error, setError] = useState<IErrorObject>(defaultErrorObj);
  const [sortType, setSortType] = useState<SortType>("alphabet");
  const [filteredGames, setFilteredGames] = useState<IGameForUI[]>([]);
  const [isFiltersMenuOpen, setIsFiltersMenuOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [achievementDiscount, setAchievementDiscount] = useState<number>(0);
  const [userAchievements, setUserAchievements] = useState<
    IMyAchievementFromApi[]
  >([]);

  const [filterConfig, setFilterConfig] = useState<IFilterConfig>({
    gameCreatorId: null,
    genresIds: [],
    priceBounds: { min: 0, max: 0 },
  });

  const hightestGamePrice =
    games.length > 0
      ? games.map((game) => game.optimalPrice).sort((a, b) => b - a)[0]
      : 0;

  const removeFilters = useCallback(() => {
    setFilterConfig({
      gameCreatorId: null,
      priceBounds: { min: 0, max: hightestGamePrice },
      genresIds: [],
    });
  }, [games, sortType, hightestGamePrice]);

  useEffect(() => {
    if (checkNewAchievements(userAchievements))
      showPopup({ msg: "Achievement get!", type: "success" });
  }, [userAchievements.length]);

  useEffect(
    () =>
      setFilteredGames(
        sortGames(filterGames(games, filterConfig), sortType, userAchievements)
      ),
    [games, sortType, filterConfig, userAchievements.length]
  );

  useEffect(
    () =>
      setFilterConfig({
        ...filterConfig,
        priceBounds: { ...filterConfig.priceBounds, max: hightestGamePrice },
      }),
    [games.length]
  );

  useEffect(
    () =>
      setFilteredGames(sortGames(filteredGames, sortType, userAchievements)),
    [sortType, userAchievements.length]
  );

  useEffect(() => {
    setIsLoading(true);
    const processAsync = async () => {
      const errorObj: IErrorObject = { ...defaultErrorObj };

      const { games, error: gamesError } = await getGames();
      if (gamesError) errorObj.games = gamesError;

      const {
        gameCreators,
        error: gameCreatorsError,
      } = await getGameCreators();
      if (gameCreatorsError) errorObj.gameCreators = gameCreatorsError;

      const { discounts, error: discountsError } = await getDiscounts();
      if (discountsError) errorObj.discounts = discountsError;

      const {
        usedDiscounts,
        error: usedDiscountsError,
      } = await getUsedDiscounts();
      if (usedDiscountsError) errorObj.usedDiscounts = usedDiscountsError;

      const { genres, error: genresError } = await getGenres();
      if (genresError) errorObj.genres = genresError;

      const { usedGenres, error: usedGenresError } = await getUsedGenres();
      if (usedGenresError) errorObj.usedGenres = usedGenresError;

      const {
        achievements: userAchievements,
        error: userAchievementsError,
      } = await getUserAchievements();
      if (userAchievementsError) errorObj.achievements = userAchievementsError;
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
      setUserAchievements(userAchievements);
      setGames(sortGames(storeGames, sortType, userAchievements));
      setFilteredGames(sortGames(storeGames, sortType, userAchievements));
      setGenres(genres);
      setGameCreators(gameCreators);
      setError(errorObj);
      setIsLoading(false);
    };
    processAsync();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.storeContainer}>
        <div
          className={`${styles.storeContent} ${
            isFiltersMenuOpen && styles.overlay
          }`}
          onClick={() => isFiltersMenuOpen && setIsFiltersMenuOpen(false)}
        >
          <GamesContainer
            achievementDiscount={achievementDiscount}
            filteredGames={filteredGames}
            error={error.games}
            isLoading={isLoading}
            setIsFiltersMenuOpen={setIsFiltersMenuOpen}
            setSortType={setSortType}
            sortType={sortType}
          />
          <FiltersContainer
            filterConfig={filterConfig}
            gameCreators={gameCreators}
            genres={genres}
            hightestGamePrice={hightestGamePrice}
            error={error.gameCreators || error.genres}
            isFiltersMenuOpen={isFiltersMenuOpen}
            isLoading={isLoading}
            removeFilters={removeFilters}
            setFilterConfig={setFilterConfig}
          />
        </div>
      </div>
    </>
  );
};

export default Store;
