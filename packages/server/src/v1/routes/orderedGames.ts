import koaRouter from "koa-joi-router";
import { orderedGamesRoutesValidation } from "../routes-validation/orderedGames";
import { orderedGamesController } from "../controllers/orderedGames";
import { checkAuth, checkAdmin } from "v1/auth";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/orderedGames",
  validate: {
    type: "json",
    body: orderedGamesRoutesValidation.post,
  },
  pre: checkAuth,
  handler: orderedGamesController.post,
});

router.route({
  method: "get",
  path: "/api/v1/orderedGames/:id",
  validate: {},
  pre: checkAuth,
  handler: orderedGamesController.get,
});

router.route({
  method: "get",
  path: "/api/v1/orderedGames",
  validate: {},
  pre: checkAdmin,
  handler: orderedGamesController.getAll,
});

router.route({
  method: "put",
  path: "/api/v1/orderedGames/:id",
  validate: {
    type: "json",
    body: orderedGamesRoutesValidation.put,
  },
  pre: checkAuth,
  handler: orderedGamesController.put,
});

export default router.middleware();
