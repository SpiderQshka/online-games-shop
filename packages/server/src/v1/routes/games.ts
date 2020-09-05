import koaRouter from "koa-joi-router";
import { gamesController } from "../controllers/games";
import { gamesRoutesValidation } from "../routes-validation/games";
import { checkAdmin } from "v1/auth";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/games",
  validate: {
    type: "json",
    body: gamesRoutesValidation.post,
  },
  pre: checkAdmin,
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
  pre: checkAdmin,
  handler: gamesController.put,
});

router.route({
  method: "delete",
  path: "/api/v1/games/:id",
  validate: {},
  pre: checkAdmin,
  handler: gamesController.delete,
});

export default router.middleware();
