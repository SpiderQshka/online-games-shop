import compose from "koa-compose";
import games from "./games";
import genres from "./genres";
import gameCreators from "./gameCreators";
import achievements from "./achievements";
import discounts from "./discounts";
import orders from "./orders";
import orderedGames from "./orderedGames";
import unlockedAchievements from "./unlockedAchievements";
import usedDiscounts from "./usedDiscounts";
import usedGenres from "./usedGenres";
import users from "./users";
import auth from "./auth";

export const routesV1Middleware = compose([
  users,
  games,
  genres,
  gameCreators,
  achievements,
  discounts,
  orders,
  orderedGames,
  unlockedAchievements,
  usedDiscounts,
  usedGenres,
  auth,
]);
