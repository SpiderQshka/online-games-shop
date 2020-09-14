import koaRouter from "koa-joi-router";
import { gameCreatorsController } from "../controllers/gameCreators";
import { gameCreatorsRoutesValidation } from "../routes-validation/gameCreators";
import { checkAdmin } from "v1/auth";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/gameCreators",
  validate: {
    type: "json",
    body: gameCreatorsRoutesValidation.post,
  },
  pre: checkAdmin,
  handler: gameCreatorsController.post,
});

router.route({
  method: "get",
  path: "/api/v1/gameCreators/:id",
  validate: {},
  handler: gameCreatorsController.get,
});

router.route({
  method: "get",
  path: "/api/v1/gameCreators",
  validate: {},
  handler: gameCreatorsController.getAll,
});

router.route({
  method: "put",
  path: "/api/v1/gameCreators/:id",
  validate: {
    type: "json",
    body: gameCreatorsRoutesValidation.put,
  },
  pre: checkAdmin,
  handler: gameCreatorsController.put,
});

export default router.middleware();
