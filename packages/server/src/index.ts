import Koa from "koa";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import json from "koa-json";
import users from "./v1/routes/users";
import session from "koa-session";
import passport from "koa-passport";
import "./v1/auth/setup";

const app = new Koa();

app.keys = ["secret"];
app.use(session({}, app));

app.use(passport.initialize());
app.use(passport.session());

app.use(json());
app.use(logger());
app.use(bodyParser());

app.use(users);

app.listen(3000, () => {
  console.log("Koa started");
});
