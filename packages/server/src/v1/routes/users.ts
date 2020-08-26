import { usersController } from "../controllers/users";
import koaRouter from "koa-joi-router";
import { checkAuth } from "../auth";
import { usersRoutesValidation } from "../routes-validation/users";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/users",
  validate: {
    type: "json",
    body: usersRoutesValidation.post,
  },
  handler: usersController.post,
});

router.route({
  method: "get",
  path: "/api/v1/users/:id",
  validate: {},
  pre: checkAuth,
  handler: usersController.get,
});

router.route({
  method: "get",
  path: "/api/v1/users",
  validate: {},
  pre: checkAuth,
  handler: usersController.getAll,
});

router.route({
  method: "put",
  path: "/api/v1/users/:id",
  validate: {
    type: "json",
    body: usersRoutesValidation.put,
  },
  handler: usersController.put,
});

router.route({
  method: "delete",
  path: "/api/v1/users/:id",
  validate: {},
  handler: usersController.delete,
});

export default router.middleware();
