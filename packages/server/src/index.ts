import Koa from "koa";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import json from "koa-json";
import { routesV1Middleware } from "./v1/routes";
import session from "koa-session";
import passport from "koa-passport";
import cors from "@koa/cors";
import "./v1/auth/setup";

const app = new Koa();

app.use(cors());
app.use(session({}, app));

app.use(passport.initialize());
app.use(passport.session());

app.use(json());
app.use(logger());
app.use(bodyParser());

app.use(routesV1Middleware);

app.listen(process.env.PORT, () => {
  console.log(`Koa started at port ${process.env.PORT}`);
});
