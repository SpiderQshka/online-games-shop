import koaRouter from "koa-joi-router";
import { unlockedAchievementsRoutesValidation } from "../routes-validation/unlockedAchievements";
import { unlockedAchievementsController } from "../controllers/unlockedAchievements";
import { checkAuth, checkAdmin } from "v1/auth";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/unlockedAchievements",
  validate: {
    type: "json",
    body: unlockedAchievementsRoutesValidation.post,
  },
  pre: checkAuth,
  handler: unlockedAchievementsController.post,
});

router.route({
  method: "get",
  path: "/api/v1/unlockedAchievements/:id",
  validate: {},
  pre: checkAuth,
  handler: unlockedAchievementsController.get,
});

router.route({
  method: "get",
  path: "/api/v1/unlockedAchievements",
  validate: {},
  pre: checkAdmin,
  handler: unlockedAchievementsController.getAll,
});

router.route({
  method: "put",
  path: "/api/v1/unlockedAchievements/:id",
  validate: {
    type: "json",
    body: unlockedAchievementsRoutesValidation.put,
  },
  pre: checkAuth,
  handler: unlockedAchievementsController.put,
});

router.route({
  method: "delete",
  path: "/api/v1/unlockedAchievements/:id",
  validate: {},
  pre: checkAuth,
  handler: unlockedAchievementsController.delete,
});

export default router.middleware();
