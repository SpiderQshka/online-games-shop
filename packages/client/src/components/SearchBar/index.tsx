import React, { useState } from "react";

import styles from "./styles.module.scss";

interface SearchBarProps {
  games: { name: string; id: number }[];
}

export const SearchBar: React.FunctionComponent<SearchBarProps> = ({
  games,
}) => {
  const [query, setQuery] = useState<string>("");
  const [isInputActive, setIsInputActive] = useState<boolean>(false);
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={styles.searchBarContainer}>
      <input
        type="text"
        className={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        onFocus={() => setIsInputActive(true)}
        onBlur={() => setIsInputActive(false)}
      />
      {isInputActive && !!query && (
        <ul className={styles.searchResultsList}>
          {!!filteredGames.length ? (
            filteredGames.map((game) => (
              <li className={styles.searchResultItem}>{game.name}</li>
            ))
          ) : (
            <li className={styles.notFound}>Nothing was found</li>
          )}
        </ul>
      )}
    </div>
  );
};
