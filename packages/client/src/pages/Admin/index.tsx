import React, { useEffect, useState } from "react";
import { Link, Redirect, Route, Switch, useHistory } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import { MdDashboard, MdDeveloperMode, MdUpdate } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { RiLogoutBoxRLine, RiShoppingCart2Line } from "react-icons/ri";
import styles from "./styles.module.scss";
import { useApi } from "context/api";
import {
  IAchievementFromApi,
  IApiError,
  IDiscount,
  IGameCreatorPut,
  IGenre,
} from "interfaces/api";
import { IGameForUI, IOrderForUI } from "interfaces/app";
import { Orders } from "./Orders";
import { UpdateOrder } from "./Orders/UpdateOrder";
import { CreateOrder } from "./Orders/CreateOrder";
import { Loader } from "components/Loader";
import { FaBars, FaGamepad, FaStar } from "react-icons/fa";
import { Games } from "./Games";
import { CreateGame } from "./Games/CreateGame";
import { UpdateGame } from "./Games/UpdateGame";
import { CreateGameCreator } from "./GameCreators/CreateGameCreator";
import { GameCreators } from "./GameCreators";
import { UpdateGameCreator } from "./GameCreators/UpdateGameCreator";
import { Achievements } from "./Achievements";
import { CreateAchievement } from "./Achievements/CreateAchievement";
import { UpdateAchievement } from "./Achievements/UpdateAchievement";

export const Admin = () => {
  const history = useHistory();

  const {
    getGames,
    getGameCreators,
    getUsedGenres,
    getDiscounts,
    getUsedDiscounts,
    getGenres,
    getOrders,
    getOrderedGames,
    getAchievements,
  } = useApi();
  const [error, setError] = useState<IApiError | null>(null);
  const [games, setGames] = useState<IGameForUI[]>([]);
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [orders, setOrders] = useState<IOrderForUI[]>([]);
  const [gameCreators, setGameCreators] = useState<IGameCreatorPut[]>([]);
  const [achievements, setAchievements] = useState<IAchievementFromApi[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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

      const { orders, error: ordersError } = await getOrders();
      if (ordersError) setError(ordersError);

      const {
        orderedGames,
        error: orderedGamesError,
      } = await getOrderedGames();
      if (orderedGamesError) setError(orderedGamesError);

      const {
        achievements,
        error: achievementsError,
      } = await getAchievements();
      if (achievementsError) setError(achievementsError);

      const gamesForUI = games.map((game) => {
        const gameCreator = gameCreators.filter(
          (el) => el.id === game.gameCreatorId
        )[0];
        const gameGenresIds = [
          ...new Set(
            usedGenres
              .filter((el) => el.gameId === game.id)
              .map((el) => el.genreId)
          ),
        ];
        const gameGenres = genres.filter((genre) =>
          gameGenresIds.includes(genre.id)
        );
        const gameDiscountsIds = usedDiscounts
          .filter((el) => el.gameId === game.id)
          .map((el) => el.discountId);
        const gameHightestDiscount = discounts
          .filter((el) => gameDiscountsIds.includes(el.id))
          .reduce(
            (prev, curr) => (prev.amount > curr.amount ? prev : curr),
            {} as IDiscount
          );
        return {
          ...game,
          gameCreator,
          genres: gameGenres,
          discount: gameHightestDiscount.amount ? gameHightestDiscount : null,
        };
      });
      const ordersForUI: IOrderForUI[] = orders.map((order) => {
        const gamesIds = orderedGames
          .filter((el) => +el.orderId === +order.id)
          .map((el) => el.gameId);
        const gamesForOrder = games.filter((game) =>
          gamesIds.includes(game.id)
        );
        return {
          ...order,
          orderedGames: gamesForOrder,
        };
      });
      setGames(gamesForUI);
      setGenres(genres);
      setGameCreators(gameCreators);
      setOrders(ordersForUI);
      setAchievements(achievements);
      setIsLoading(false);
    };
    processAsync();
  }, [updateTrigger, history.location.pathname]);
  return (
    <div className={`${styles.adminContainer} ${isMenuOpen && styles.overlay}`}>
      <div
        className={`${styles.menuContainer} ${isMenuOpen && styles.openedMenu}`}
      >
        <h2 className={styles.header}>Menu</h2>
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <Link
              to="/admin/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className={`${styles.menuLink} ${
                history.location.pathname.includes("/admin/dashboard") &&
                styles.active
              }`}
            >
              <MdDashboard size="20px" className={styles.icon} /> Dashboard
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link
              to="/admin/orders"
              onClick={() => setIsMenuOpen(false)}
              className={`${styles.menuLink} ${
                history.location.pathname.includes("/admin/orders") &&
                styles.active
              }`}
            >
              <RiShoppingCart2Line size="20px" className={styles.icon} />
              Orders
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link
              to="/admin/games"
              onClick={() => setIsMenuOpen(false)}
              className={`${styles.menuLink} ${
                history.location.pathname.includes("/admin/games") &&
                styles.active
              }`}
            >
              <FaGamepad size="20px" className={styles.icon} />
              Games
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link
              to="/admin/gameCreators"
              onClick={() => setIsMenuOpen(false)}
              className={`${styles.menuLink} ${
                history.location.pathname.includes("/admin/gameCreators") &&
                styles.active
              }`}
            >
              <MdDeveloperMode size="20px" className={styles.icon} />
              Game creators
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link
              to="/admin/achievements"
              onClick={() => setIsMenuOpen(false)}
              className={`${styles.menuLink} ${
                history.location.pathname.includes("/admin/achievements") &&
                styles.active
              }`}
            >
              <FaStar size="20px" className={styles.icon} />
              Achievements
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`${styles.menuLink}`}
            >
              <RiLogoutBoxRLine size="20px" className={styles.icon} />
              Go out
            </Link>
          </li>
        </ul>
      </div>

      <div className={styles.dataContainer}>
        <div className={styles.actionsBlock}>
          <button
            className={styles.btn}
            onClick={() => {
              setUpdateTrigger(!updateTrigger);
              setIsMenuOpen(false);
            }}
          >
            <MdUpdate size="100%" />
          </button>
          <button
            className={`${styles.btn} ${styles.menuBtn}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars size="100%" />
          </button>
        </div>
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : (
          <Switch>
            <Route
              path="/admin/dashboard"
              component={() => (
                <Dashboard
                  gameCreators={gameCreators}
                  games={games}
                  genres={genres}
                />
              )}
            />
            <Route
              exact
              path="/admin/orders"
              component={() => <Orders orders={orders} />}
            />
            <Route
              exact
              path="/admin/games"
              component={() => <Games games={games} />}
            />
            <Route
              exact
              path="/admin/gameCreators"
              component={() => <GameCreators gameCreators={gameCreators} />}
            />
            <Route
              exact
              path="/admin/achievements"
              component={() => <Achievements achievements={achievements} />}
            />
            <Route
              exact
              path="/admin/orders/create"
              component={() => <CreateOrder />}
            />
            <Route
              exact
              path="/admin/games/create"
              component={() => <CreateGame />}
            />
            <Route
              exact
              path="/admin/gameCreators/create"
              component={() => <CreateGameCreator />}
            />
            <Route
              exact
              path="/admin/achievements/create"
              component={() => <CreateAchievement />}
            />
            <Route
              path="/admin/orders/:id"
              component={() => <UpdateOrder orders={orders} />}
            />
            <Route
              path="/admin/games/:id"
              component={() => <UpdateGame games={games} />}
            />
            <Route
              path="/admin/achievements/:id"
              component={() => (
                <UpdateAchievement achievements={achievements} />
              )}
            />
            <Route
              path="/admin/gameCreators/:id"
              component={() => (
                <UpdateGameCreator gameCreators={gameCreators} />
              )}
            />
            <Route component={() => <Redirect to="/admin/dashboard" />} />
          </Switch>
        )}
      </div>
    </div>
  );
};

export default Admin;
