import koaRouter from "koa-joi-router";
import { gamesController } from "../controllers/games";
import { gamesRoutesValidation } from "../routes-validation/games";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/games",
  validate: {
    type: "json",
    body: gamesRoutesValidation.post,
  },
  handler: gamesController.post,
});

router.route({
  method: "get",
  path: "/api/v1/games/:id",
  validate: {},
  handler: gamesController.get,
});

router.route({
  method: "get",
  path: "/api/v1/games",
  validate: {},
  handler: gamesController.getAll,
});

router.route({
  method: "put",
  path: "/api/v1/games/:id",
  validate: {
    type: "json",
    body: gamesRoutesValidation.put,
  },
  handler: gamesController.put,
});

router.route({
  method: "delete",
  path: "/api/v1/games/:id",
  validate: {},
  handler: gamesController.delete,
});

export default router.middleware();
