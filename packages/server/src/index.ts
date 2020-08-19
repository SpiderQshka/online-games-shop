import Koa from "koa";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import json from "koa-json";
import users from "./v1/routes/users";

const app = new Koa();

app.use(json());
app.use(logger());
app.use(bodyParser());

app.use(users);

app.listen(3000, () => {
  console.log("Koa started");
});
