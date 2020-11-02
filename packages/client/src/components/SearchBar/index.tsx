import { useApi } from "context/api";
import { IApiError, IGameFromApi } from "interfaces/api";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import styles from "./styles.module.scss";

export const SearchBar: React.FunctionComponent = () => {
  const history = useHistory();
  const { queryGame } = useApi();
  const [query, setQuery] = useState<string>("");
  const [isInputActive, setIsInputActive] = useState<boolean>(false);
  const [error, setError] = useState<IApiError | null>(null);
  const [games, setGames] = useState<IGameFromApi[]>([]);

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const processAsync = async () => {
      const { games, error } = await queryGame(query);
      if (error) setError(error);
      setGames(games);
    };
    processAsync();
  }, [query]);

  return (
    <div className={styles.searchBarContainer}>
      <input
        type="text"
        className={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        onFocus={() => setIsInputActive(true)}
        onBlur={(e) => !e.relatedTarget && setIsInputActive(false)}
      />
      {isInputActive && !!query && (
        <ul className={styles.searchResultsList} tabIndex={0}>
          {!!filteredGames.length ? (
            filteredGames.map((game) => (
              <li
                className={styles.searchResultItem}
                onClick={() => {
                  history.push(`/store/item/${game.id}`);
                  setIsInputActive(false);
                }}
                key={game.id}
              >
                {game.name}
              </li>
            ))
          ) : (
            <li className={styles.notFound}>Nothing was found</li>
          )}
        </ul>
      )}
    </div>
  );
};
