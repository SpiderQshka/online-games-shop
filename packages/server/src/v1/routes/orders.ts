import koaRouter from "koa-joi-router";
import { ordersRoutesValidation } from "../routes-validation/orders";
import { ordersController } from "../controllers/orders";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/orders",
  validate: {
    type: "json",
    body: ordersRoutesValidation.post,
  },
  handler: ordersController.post,
});

router.route({
  method: "get",
  path: "/api/v1/orders/:id",
  validate: {},
  handler: ordersController.get,
});

router.route({
  method: "get",
  path: "/api/v1/orders",
  validate: {},
  handler: ordersController.getAll,
});

router.route({
  method: "put",
  path: "/api/v1/orders/:id",
  validate: {
    type: "json",
    body: ordersRoutesValidation.put,
  },
  handler: ordersController.put,
});

router.route({
  method: "delete",
  path: "/api/v1/orders/:id",
  validate: {},
  handler: ordersController.delete,
});

export default router.middleware();
