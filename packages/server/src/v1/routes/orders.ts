import koaRouter from "koa-joi-router";
import { ordersRoutesValidation } from "../routes-validation/orders";
import { ordersController } from "../controllers/orders";
import { checkAdmin, checkAuth } from "v1/auth";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/orders",
  validate: {
    type: "json",
    body: ordersRoutesValidation.post,
  },
  pre: checkAuth,
  handler: ordersController.post,
});

router.route({
  method: "get",
  path: "/api/v1/orders/:id",
  validate: {},
  pre: checkAuth,
  handler: ordersController.get,
});

router.route({
  method: "get",
  path: "/api/v1/orders",
  validate: {},
  pre: checkAdmin,
  handler: ordersController.getAll,
});

router.route({
  method: "get",
  path: "/api/v1/my/orders",
  validate: {},
  pre: checkAdmin,
  handler: ordersController.getMy,
});

router.route({
  method: "put",
  path: "/api/v1/orders/:id",
  validate: {
    type: "json",
    body: ordersRoutesValidation.put,
  },
  pre: checkAuth,
  handler: ordersController.put,
});

export default router.middleware();
