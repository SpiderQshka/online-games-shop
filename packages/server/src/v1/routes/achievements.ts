import koaRouter from "koa-joi-router";
import { achievementsRoutesValidation } from "../routes-validation/achievements";
import { achievementsController } from "../controllers/achievements";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/achievements",
  validate: {
    type: "json",
    body: achievementsRoutesValidation.post,
  },
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
  method: "put",
  path: "/api/v1/achievements/:id",
  validate: {
    type: "json",
    body: achievementsRoutesValidation.put,
  },
  handler: achievementsController.put,
});

router.route({
  method: "delete",
  path: "/api/v1/achievements/:id",
  validate: {},
  handler: achievementsController.delete,
});

export default router.middleware();
