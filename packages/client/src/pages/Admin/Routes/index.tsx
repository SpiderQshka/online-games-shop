import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { Dashboard } from "../sections/Dashboard";
import { useApi } from "context/api";
import {
  IAchievementFromApi,
  IApiError,
  IDiscountFromApi,
  IGameCreatorFromApi,
  IGenreFromApi,
  IUser,
} from "interfaces/api";
import { IDiscountForUI, IGameForUI, OrderWithUserId } from "interfaces/app";
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
import { CreateAchievement } from "../sections/Achievements/CreateAchievement";
import { UpdateAchievement } from "../sections/Achievements/UpdateAchievement";
import { Discounts } from "../sections/Discounts";
import { CreateDiscount } from "../sections/Discounts/CreateDiscount";
import { UpdateDiscount } from "../sections/Discounts/UpdateDiscount";
import { Loader } from "components/Loader";
import styles from "./styles.module.scss";
import { Genres } from "../sections/Genres";
import { CreateGenre } from "../sections/Genres/CreateGenre";
import { UpdateGenre } from "../sections/Genres/UpdateGenre";

interface RoutesProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  updateTrigger: boolean;
}

export const Routes: React.FunctionComponent<RoutesProps> = ({
  setIsLoading,
  isLoading,
  updateTrigger,
}) => {
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
    getUsers,
  } = useApi();
  const [error, setError] = useState<IApiError | null>(null);
  const [games, setGames] = useState<IGameForUI[]>([]);
  const [genres, setGenres] = useState<IGenreFromApi[]>([]);
  const [orders, setOrders] = useState<OrderWithUserId[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [discounts, setDiscounts] = useState<IDiscountForUI[]>([]);
  const [gameCreators, setGameCreators] = useState<IGameCreatorFromApi[]>([]);
  const [achievements, setAchievements] = useState<IAchievementFromApi[]>([]);

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

      const { users, error: usersError } = await getUsers();
      if (usersError) setError(usersError);

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
            {} as IDiscountFromApi
          );
        return {
          ...game,
          gameCreator,
          genres: gameGenres,
          discount: gameHightestDiscount.amount ? gameHightestDiscount : null,
        };
      });
      const ordersForUI: OrderWithUserId[] = orders.map((order) => {
        const gamesIds = orderedGames
          .filter((el) => +el.orderId === +order.id)
          .map((el) => el.gameId);
        const gamesForOrder = games.filter((game) =>
          gamesIds.includes(game.id)
        );
        const userId = orderedGames.filter(
          (orderedGame) => orderedGame.orderId === order.id
        )[0].userId;
        return {
          ...order,
          orderedGames: gamesForOrder,
          userId,
        };
      });
      const discountsForUI = discounts.map((discount) => {
        const gamesIds = usedDiscounts
          .filter((el) => el.discountId === discount.id)
          .map((el) => el.gameId);
        const gamesForDiscount = games.filter((game) =>
          gamesIds.includes(game.id)
        );
        return { ...discount, games: gamesForDiscount };
      });
      setGames(gamesForUI);
      setGenres(genres);
      setGameCreators(gameCreators);
      setOrders(ordersForUI);
      setAchievements(achievements);
      setUsers(users);
      setDiscounts(discountsForUI);
      setIsLoading(false);
    };
    processAsync();
  }, [history.location.pathname, updateTrigger]);
  return isLoading ? (
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
        path="/admin/discounts"
        component={() => <Discounts discounts={discounts} />}
      />
      <Route
        exact
        path="/admin/genres"
        component={() => <Genres genres={genres} />}
      />
      <Route
        exact
        path="/admin/orders/create"
        component={() => <CreateOrder users={users} games={games} />}
      />
      <Route
        exact
        path="/admin/games/create"
        component={() => (
          <CreateGame gameCreators={gameCreators} genres={genres} />
        )}
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
        exact
        path="/admin/discounts/create"
        component={() => <CreateDiscount games={games} />}
      />
      <Route
        exact
        path="/admin/genres/create"
        component={() => <CreateGenre />}
      />
      <Route
        path="/admin/orders/:id"
        component={() => <UpdateOrder games={games} orders={orders} />}
      />
      <Route
        path="/admin/games/:id"
        component={() => (
          <UpdateGame
            games={games}
            gameCreators={gameCreators}
            genres={genres}
          />
        )}
      />
      <Route
        path="/admin/achievements/:id"
        component={() => <UpdateAchievement achievements={achievements} />}
      />
      <Route
        path="/admin/gameCreators/:id"
        component={() => <UpdateGameCreator gameCreators={gameCreators} />}
      />
      <Route
        path="/admin/discounts/:id"
        component={() => <UpdateDiscount games={games} discounts={discounts} />}
      />
      <Route
        path="/admin/genres/:id"
        component={() => <UpdateGenre genres={genres} />}
      />
      <Route component={() => <Redirect to="/admin/dashboard" />} />
    </Switch>
  );
};
