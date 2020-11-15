import { useApi } from "context/api";
import { IApiError, IGameFromApi } from "interfaces/api";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import _ from "lodash";

import styles from "./styles.module.scss";
import { usePopup } from "context/popup";

export const SearchBar: React.FunctionComponent = () => {
  const history = useHistory();
  const { queryGame } = useApi();
  const { showPopup } = usePopup();
  const [query, setQuery] = useState<string>("");
  const [isInputActive, setIsInputActive] = useState<boolean>(false);
  const [error, setError] = useState<IApiError | null>(null);
  const [games, setGames] = useState<IGameFromApi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(query)
  );

  useEffect(() => {
    setIsLoading(true);
    const debounced = _.debounce(() => {
      if (query.length > 2) {
        const processAsync = async () => {
          const { games, error } = await queryGame(query);
          if (error) setError(error);
          setGames(games);
          setIsLoading(false);
        };
        processAsync();
      } else setIsLoading(false);
    }, 200);
    debounced();
  }, [query]);

  useEffect(() => {
    if (error) showPopup({ msg: error.msg, code: error.status, type: "error" });
  }, [error]);

  return (
    <div className={styles.searchBarContainer}>
      <input
        type="text"
        className={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value.toLowerCase())}
        placeholder="Search"
        onFocus={() => setIsInputActive(true)}
        onBlur={(e) => !e.relatedTarget && setIsInputActive(false)}
      />
      {isInputActive && !!query && (
        <ul className={styles.searchResultsList} tabIndex={0}>
          {query.length > 2 ? (
            !!filteredGames.length ? (
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
            ) : isLoading ? (
              <li className={styles.notFound}>Loading...</li>
            ) : (
              <li className={styles.notFound}>Nothing was found</li>
            )
          ) : (
            <li className={styles.notFound}>Type 3 or more symbols</li>
          )}
        </ul>
      )}
    </div>
  );
};
