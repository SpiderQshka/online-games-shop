import koaRouter from "koa-joi-router";
import { orderedGamesRoutesValidation } from "../routes-validation/orderedGames";
import { orderedGamesController } from "../controllers/orderedGames";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/orderedGames",
  validate: {
    type: "json",
    body: orderedGamesRoutesValidation.post,
  },
  handler: orderedGamesController.post,
});

router.route({
  method: "get",
  path: "/api/v1/orderedGames/:id",
  validate: {},
  handler: orderedGamesController.get,
});

router.route({
  method: "get",
  path: "/api/v1/orderedGames",
  validate: {},
  handler: orderedGamesController.getAll,
});

router.route({
  method: "put",
  path: "/api/v1/orderedGames/:id",
  validate: {
    type: "json",
    body: orderedGamesRoutesValidation.put,
  },
  handler: orderedGamesController.put,
});

router.route({
  method: "delete",
  path: "/api/v1/orderedGames/:id",
  validate: {},
  handler: orderedGamesController.delete,
});

export default router.middleware();
