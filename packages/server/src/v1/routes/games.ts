import koaRouter from "koa-joi-router";
import { gamesController } from "../controllers/games";
import { gamesRoutesValidation } from "../routes-validation/games";
import { checkAdmin, checkAuth } from "v1/auth";
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
  method: "get",
  path: "/api/v1/my/games",
  validate: {},
  pre: checkAuth,
  handler: gamesController.getMy,
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
  method: "get",
  path: "/api/v1/games/query/:query",
  validate: {},
  handler: gamesController.query,
});

router.route({
  method: "post",
  path: "/api/v1/games/block",
  validate: {
    type: "json",
    body: gamesRoutesValidation.block,
  },
  pre: checkAuth,
  handler: gamesController.block,
});

router.route({
  method: "post",
  path: "/api/v1/games/unblock",
  validate: {
    type: "json",
    body: gamesRoutesValidation.unblock,
  },
  pre: checkAuth,
  handler: gamesController.unblock,
});

export default router.middleware();
