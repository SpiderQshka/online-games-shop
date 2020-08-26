import koaRouter from "koa-joi-router";
import { unlockedAchievementsRoutesValidation } from "../routes-validation/unlockedAchievements";
import { unlockedAchievementsController } from "../controllers/unlockedAchievements";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/unlockedAchievements",
  validate: {
    type: "json",
    body: unlockedAchievementsRoutesValidation.post,
  },
  handler: unlockedAchievementsController.post,
});

router.route({
  method: "get",
  path: "/api/v1/unlockedAchievements/:id",
  validate: {},
  handler: unlockedAchievementsController.get,
});

router.route({
  method: "get",
  path: "/api/v1/unlockedAchievements",
  validate: {},
  handler: unlockedAchievementsController.getAll,
});

router.route({
  method: "put",
  path: "/api/v1/unlockedAchievements/:id",
  validate: {
    type: "json",
    body: unlockedAchievementsRoutesValidation.put,
  },
  handler: unlockedAchievementsController.put,
});

router.route({
  method: "delete",
  path: "/api/v1/unlockedAchievements/:id",
  validate: {},
  handler: unlockedAchievementsController.delete,
});

export default router.middleware();
