import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Dashboard } from "../sections/Dashboard";
import { useApi } from "context/api";
import {
  IAchievementFromApi,
  IGameCreatorFromApi,
  IGenreFromApi,
  IUser,
} from "interfaces/api";
import {
  defaultErrorObj,
  IDiscountForUI,
  IErrorObject,
  IGameForUI,
  IOrderWithUserId,
} from "interfaces/app";
import { Orders } from "../sections/Orders";
import { UpdateOrder } from "../sections/Orders/UpdateOrder";
import { CreateOrder } from "../sections/Orders/CreateOrder";
import { Games } from "../sections/Games";
import { CreateGame } from "../sections/Games/CreateGame";
import { UpdateGame } from "../sections/Games/UpdateGame";
import { CreateGameCreator } from "../sections/GameCreators/CreateGameCreator";
import { GameCreators } from "../sections/GameCreators";
import { UpdateGameCreator } from "../sections/GameCreators/UpdateGameCreator";
import { Achievements } from "../sections/Achievements";
import { UpdateAchievement } from "../sections/Achievements/UpdateAchievement";
import { Discounts } from "../sections/Discounts";
import { CreateDiscount } from "../sections/Discounts/CreateDiscount";
import { UpdateDiscount } from "../sections/Discounts/UpdateDiscount";
import { Loader } from "components/Loader";
import styles from "./styles.module.scss";
import { Genres } from "../sections/Genres";
import { CreateGenre } from "../sections/Genres/CreateGenre";
import { UpdateGenre } from "../sections/Genres/UpdateGenre";
import {
  formatDiscountsForUI,
  formatGamesForUI,
  formatOrdersForUI,
} from "utils/helpers";
import { Error } from "components/Error";

interface RoutesProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  updateTrigger: boolean;
  setUpdateTrigger: (trigger: boolean) => void;
}

export const Routes: React.FunctionComponent<RoutesProps> = ({
  setIsLoading,
  isLoading,
  updateTrigger,
  setUpdateTrigger,
}) => {
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
    getUsers,
  } = useApi();
  const [error, setError] = useState<IErrorObject>(defaultErrorObj);
  const [games, setGames] = useState<IGameForUI[]>([]);
  const [genres, setGenres] = useState<IGenreFromApi[]>([]);
  const [orders, setOrders] = useState<IOrderWithUserId[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [discounts, setDiscounts] = useState<IDiscountForUI[]>([]);
  const [gameCreators, setGameCreators] = useState<IGameCreatorFromApi[]>([]);
  const [achievements, setAchievements] = useState<IAchievementFromApi[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const processAsync = async () => {
      const errorObj = { ...defaultErrorObj } as IErrorObject;

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

      const { orders, error: ordersError } = await getOrders();
      if (ordersError) errorObj.orders = ordersError;

      const { users, error: usersError } = await getUsers();
      if (usersError) errorObj.users = usersError;

      const {
        orderedGames,
        error: orderedGamesError,
      } = await getOrderedGames();
      if (orderedGamesError) errorObj.orderedGames = orderedGamesError;

      const {
        achievements,
        error: achievementsError,
      } = await getAchievements();
      if (achievementsError) errorObj.achievements = achievementsError;

      const gamesForUI = formatGamesForUI({
        usedGenres,
        usedDiscounts,
        genres,
        discounts,
        gameCreators,
        games,
        userAchievements: [],
      });

      const ordersForUI = formatOrdersForUI({
        discounts,
        orderedGames,
        orders,
        usedDiscounts,
        games,
      });

      const discountsForUI = formatDiscountsForUI({
        games,
        usedDiscounts,
        discounts,
      });
      !errorObj.games && setGames(gamesForUI);
      !errorObj.genres && setGenres(genres);
      !errorObj.gameCreators && setGameCreators(gameCreators);
      !errorObj.orders && setOrders(ordersForUI);
      !errorObj.achievements && setAchievements(achievements);
      !errorObj.users && setUsers(users);
      !errorObj.discounts && setDiscounts(discountsForUI);
      setError(errorObj);
      setIsLoading(false);
    };
    processAsync();
  }, [updateTrigger]);

  return isLoading ? (
    <div className={styles.loaderContainer}>
      <Loader />
    </div>
  ) : error.auth ? (
    <Error />
  ) : (
    <Switch>
      <Route
        path="/admin/dashboard"
        component={() => (
          <Dashboard
            orders={orders}
            gameCreators={gameCreators}
            games={games}
            genres={genres}
            error={
              error.orders || error.gameCreators || error.games || error.genres
            }
          />
        )}
      />
      <Route
        exact
        path="/admin/orders"
        component={() => <Orders error={error.orders} orders={orders} />}
      />
      <Route
        exact
        path="/admin/games"
        component={() => <Games error={error.games} games={games} />}
      />
      <Route
        exact
        path="/admin/gameCreators"
        component={() => (
          <GameCreators
            error={error.gameCreators}
            gameCreators={gameCreators}
          />
        )}
      />
      <Route
        exact
        path="/admin/achievements"
        component={() => (
          <Achievements
            error={error.achievements}
            achievements={achievements}
          />
        )}
      />
      <Route
        exact
        path="/admin/discounts"
        component={() => (
          <Discounts error={error.discounts} discounts={discounts} />
        )}
      />
      <Route
        exact
        path="/admin/genres"
        component={() => <Genres error={error.genres} genres={genres} />}
      />
      <Route
        exact
        path="/admin/orders/create"
        component={() => (
          <CreateOrder
            error={error.orders}
            setUpdateTrigger={setUpdateTrigger}
            updateTrigger={updateTrigger}
            users={users}
            games={games}
          />
        )}
      />
      <Route
        exact
        path="/admin/games/create"
        component={() => (
          <CreateGame
            error={error.games}
            setUpdateTrigger={setUpdateTrigger}
            updateTrigger={updateTrigger}
            gameCreators={gameCreators}
            genres={genres}
          />
        )}
      />
      <Route
        exact
        path="/admin/gameCreators/create"
        component={() => (
          <CreateGameCreator
            error={error.gameCreators}
            setUpdateTrigger={setUpdateTrigger}
            updateTrigger={updateTrigger}
          />
        )}
      />
      <Route
        exact
        path="/admin/discounts/create"
        component={() => (
          <CreateDiscount
            error={error.discounts}
            setUpdateTrigger={setUpdateTrigger}
            updateTrigger={updateTrigger}
            games={games}
          />
        )}
      />
      <Route
        exact
        path="/admin/genres/create"
        component={() => (
          <CreateGenre
            error={error.genres}
            setUpdateTrigger={setUpdateTrigger}
            updateTrigger={updateTrigger}
          />
        )}
      />
      <Route
        path="/admin/orders/:id"
        component={() => (
          <UpdateOrder
            error={error.orders}
            setUpdateTrigger={setUpdateTrigger}
            updateTrigger={updateTrigger}
            games={games}
            orders={orders}
          />
        )}
      />
      <Route
        path="/admin/games/:id"
        component={() => (
          <UpdateGame
            error={error.games}
            games={games}
            gameCreators={gameCreators}
            genres={genres}
            setUpdateTrigger={setUpdateTrigger}
            updateTrigger={updateTrigger}
          />
        )}
      />
      <Route
        path="/admin/achievements/:id"
        component={() => (
          <UpdateAchievement
            setUpdateTrigger={setUpdateTrigger}
            updateTrigger={updateTrigger}
            achievements={achievements}
            error={error.achievements}
          />
        )}
      />
      <Route
        path="/admin/gameCreators/:id"
        component={() => (
          <UpdateGameCreator
            error={error.gameCreators}
            setUpdateTrigger={setUpdateTrigger}
            updateTrigger={updateTrigger}
            gameCreators={gameCreators}
          />
        )}
      />
      <Route
        path="/admin/discounts/:id"
        component={() => (
          <UpdateDiscount
            error={error.discounts}
            setUpdateTrigger={setUpdateTrigger}
            updateTrigger={updateTrigger}
            games={games}
            discounts={discounts}
          />
        )}
      />
      <Route
        path="/admin/genres/:id"
        component={() => (
          <UpdateGenre
            error={error.genres}
            setUpdateTrigger={setUpdateTrigger}
            updateTrigger={updateTrigger}
            genres={genres}
          />
        )}
      />
      <Route component={() => <Redirect to="/admin/dashboard" />} />
    </Switch>
  );
};
