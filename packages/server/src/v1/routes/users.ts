import { usersController } from "../controllers/users";
import koaRouter from "koa-joi-router";
const Joi = koaRouter.Joi;
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/users",
  validate: {
    type: "json",
    body: {
      login: Joi.string().min(5).required(),
      password: Joi.string().min(5).required(),
    },
  },
  handler: usersController.post,
});

router.route({
  method: "get",
  path: "/api/v1/users/:id",
  validate: {},
  handler: usersController.get,
});

router.route({
  method: "put",
  path: "/api/v1/users/:id",
  validate: {
    type: "json",
    body: {
      login: Joi.string().min(5),
      password: Joi.string().min(5),
    },
  },
  handler: usersController.put,
});

router.route({
  method: "post",
  path: "/api/v1/users/login",
  validate: {},
  handler: usersController.login,
});

router.route({
  method: "delete",
  path: "/api/v1/users/:id",
  validate: {},
  handler: usersController.delete,
});

export default router.middleware();
