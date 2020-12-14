import koaRouter from "koa-joi-router";
import { achievementsRoutesValidation } from "../routes-validation/achievements";
import { achievementsController } from "../controllers/achievements";
import { checkAdmin } from "v1/auth";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/achievements",
  validate: {
    type: "json",
    body: achievementsRoutesValidation.post,
  },
  pre: checkAdmin,
  handler: achievementsController.post,
});

router.route({
  method: "get",
  path: "/api/v1/achievements/:id",
  validate: {},
  handler: achievementsController.get,
});

router.route({
  method: "get",
  path: "/api/v1/achievements",
  validate: {},
  handler: achievementsController.getAll,
});

router.route({
  method: "get",
  path: "/api/v1/my/achievements",
  validate: {},
  handler: achievementsController.getMy,
});

router.route({
  method: "put",
  path: "/api/v1/achievements/:id",
  validate: {
    type: "json",
    body: achievementsRoutesValidation.put,
  },
  pre: checkAdmin,
  handler: achievementsController.put,
});

export default router.middleware();
