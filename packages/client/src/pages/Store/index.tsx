import { Header } from "components/Header";
import { useApi } from "context/api";
import {
  IApiError,
  IDiscount,
  IGame,
  IGameCreator,
  IGenre,
  IUsedDiscount,
  IUsedGenre,
} from "interfaces/api";
import React, { useEffect, useRef, useState } from "react";
import { filterGames, getHightestDiscountForGame, sortGames } from "utils/api";
import { FaWindowClose } from "react-icons/fa";
import styles from "./styles.module.scss";

export const Store = () => {
  const {
    getGames,
    getGameCreators,
    getDiscounts,
    getUsedDiscounts,
    getGenres,
    getUsedGenres,
  } = useApi();
  const [games, setGames] = useState<IGame[]>([]);
  const [gameCreators, setGameCreators] = useState<IGameCreator[]>([]);
  const [discounts, setDiscounts] = useState<IDiscount[]>([]);
  const [usedDiscounts, setUsedDiscounts] = useState<IUsedDiscount[]>([]);
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [usedGenres, setUsedGenres] = useState<IUsedGenre[]>([]);
  const [error, setError] = useState<IApiError | null>(null);
  const [sortType, setSortType] = useState<"creationDate" | "alphabet">(
    "alphabet"
  );
  const [filtersAmount, setFiltersAmount] = useState<number>(0);
  const [filteredGames, setFilteredGames] = useState<IGame[]>([]);

  const formRef = useRef(null);

  const removeFilters = () => {
    if (formRef.current) {
      const form = (formRef.current as any) as HTMLFormElement;
      const formInputs = [...form.elements] as HTMLInputElement[];
      const checkedFormInputs = formInputs.filter((input) => input.checked);
      checkedFormInputs.forEach((input) => (input.checked = false));
    }
    setFilteredGames(sortGames(games, sortType));
    setFiltersAmount(0);
  };

  const handleFilterTypeChange = (e: React.FormEvent) => {
    const form = e.currentTarget as HTMLFormElement;
    const formInputs = [...form.elements] as HTMLInputElement[];
    const checkedFormInputs = formInputs.filter((input) => input.checked);

    if (checkedFormInputs.length) {
      const filterOptions = checkedFormInputs.reduce((prev, curr) => {
        switch (curr.type) {
          case "radio":
            return {
              ...prev,
              [curr.name]: +curr.value,
            };
          case "checkbox":
            return {
              ...prev,
              [curr.name]: prev[curr.name]
                ? [...prev[curr.name], +curr.value]
                : [+curr.value],
            };
        }
        return {};
      }, {} as any);
      setFilteredGames(
        sortGames(filterGames(games, filterOptions, usedGenres), sortType)
      );
      setFiltersAmount(checkedFormInputs.length);
    } else removeFilters();
  };

  useEffect(() => {
    setFilteredGames(sortGames(filteredGames, sortType));
  }, [sortType]);

  useEffect(() => {
    getGames().then(({ games, error }) => {
      if (error) setError(error);
      else {
        setGames(sortGames(games, sortType));
        setFilteredGames(sortGames(games, sortType));
      }
    });
    getGameCreators().then(({ gameCreators, error }) => {
      if (error) setError(error);
      else setGameCreators(gameCreators);
    });
    getDiscounts().then(({ discounts, error }) => {
      if (error) setError(error);
      else setDiscounts(discounts);
    });
    getUsedDiscounts().then(({ usedDiscounts, error }) => {
      if (error) setError(error);
      else setUsedDiscounts(usedDiscounts);
    });
    getGenres().then(({ genres, error }) => {
      if (error) setError(error);
      else setGenres(genres);
    });
    getUsedGenres().then(({ usedGenres, error }) => {
      if (error) setError(error);
      else setUsedGenres(usedGenres);
    });
  }, []);
  return (
    <>
      <Header />
      <div className={styles.storeContainer}>
        <div className={styles.storeContent}>
          <div className={styles.gamesContainer}>
            <div className={styles.infoContainer}>
              <span className={styles.text}>Sort by</span>
              <select
                name="sortBy"
                className={styles.sortBySelect}
                onChange={(e) =>
                  setSortType(e.target.value as "creationDate" | "alphabet")
                }
                value={sortType}
              >
                <option value="creationDate" className={styles.sortByItem}>
                  Creation date
                </option>
                <option value="alphabet" className={styles.sortByItem}>
                  Alphabet
                </option>
              </select>
            </div>
            <ul className={styles.gamesList}>
              {filteredGames.map((game) => (
                <li className={styles.gameItem} key={game.id}>
                  <div className={styles.logoContainer}></div>
                  <p className={styles.name}>{game.name}</p>
                  <p className={styles.gameCreator}>
                    {!!gameCreators.length
                      ? gameCreators.filter(
                          (el) => el.id === game.gameCreatorId
                        )[0].name
                      : "Loading.."}
                  </p>
                  <div className={styles.priceBlock}>
                    {getHightestDiscountForGame(
                      game.id,
                      discounts,
                      usedDiscounts
                    ) && (
                      <>
                        <span className={styles.saleSize}>
                          {`-${
                            getHightestDiscountForGame(
                              game.id,
                              discounts,
                              usedDiscounts
                            )?.amount
                          }%`}
                        </span>
                        <span className={styles.previousPrice}>
                          {game.price} $
                        </span>
                      </>
                    )}

                    <span className={styles.currentPrice}>
                      {Math.trunc(
                        game.price *
                          (getHightestDiscountForGame(
                            game.id,
                            discounts,
                            usedDiscounts
                          )
                            ? (100 -
                                (getHightestDiscountForGame(
                                  game.id,
                                  discounts,
                                  usedDiscounts
                                )?.amount as number)) /
                              100
                            : 1)
                      )}
                      $
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <aside className={styles.filtersContainer}>
            <h5
              className={`${styles.header} ${!!filtersAmount && styles.active}`}
            >
              Filters
              <span className={styles.filtersAmount}>
                {!!filtersAmount && filtersAmount}
              </span>
              <span
                className={styles.closeIcon}
                onClick={() => removeFilters()}
              >
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
                {genres.map((genre) => (
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
                ))}
              </ul>
              <h4 className={styles.inputGroupHeader}>Game creators</h4>
              <ul className={styles.inputGroup}>
                {gameCreators.map((gameCreator) => (
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
                ))}
              </ul>
            </form>
          </aside>
        </div>
      </div>
    </>
  );
};

//
