import koaRouter from "koa-joi-router";
import { gameCreatorsController } from "../controllers/gameCreators";
import { gameCreatorsRoutesValidation } from "../routes-validation/gameCreators";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/gameCreators",
  validate: {
    type: "json",
    body: gameCreatorsRoutesValidation.post,
  },
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
  handler: gameCreatorsController.put,
});

router.route({
  method: "delete",
  path: "/api/v1/gameCreators/:id",
  validate: {},
  handler: gameCreatorsController.delete,
});

export default router.middleware();
