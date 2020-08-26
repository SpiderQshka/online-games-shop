import Koa from "koa";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import json from "koa-json";
import users from "./v1/routes/users";
import session from "koa-session";
import passport from "koa-passport";
import "./v1/auth/setup";
import games from "./v1/routes/games";
import genres from "./v1/routes/genres";
import gameCreators from "./v1/routes/gameCreators";
import achievements from "./v1/routes/achievements";
import discounts from "./v1/routes/discounts";
import orders from "./v1/routes/orders";
import orderedGames from "./v1/routes/orderedGames";
import unlockedAchievements from "./v1/routes/unlockedAchievements";
import usedDiscounts from "./v1/routes/usedDiscounts";
import usedGenres from "./v1/routes/usedGenres";
import auth from "./v1/routes/auth";

const app = new Koa();

app.keys = ["secret"];
app.use(session({}, app));

app.use(passport.initialize());
app.use(passport.session());

app.use(json());
app.use(logger());
app.use(bodyParser());

app.use(users);
app.use(games);
app.use(genres);
app.use(gameCreators);
app.use(achievements);
app.use(discounts);
app.use(orders);
app.use(orderedGames);
app.use(unlockedAchievements);
app.use(usedDiscounts);
app.use(usedGenres);
app.use(auth);

app.listen(3000, () => {
  console.log("Koa started");
});
