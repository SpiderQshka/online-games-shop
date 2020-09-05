import koaRouter from "koa-joi-router";
import { discountsRoutesValidation } from "../routes-validation/discounts";
import { discountsController } from "../controllers/discounts";
import { checkAdmin } from "v1/auth";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/discounts",
  validate: {
    type: "json",
    body: discountsRoutesValidation.post,
  },
  pre: checkAdmin,
  handler: discountsController.post,
});

router.route({
  method: "get",
  path: "/api/v1/discounts/:id",
  validate: {},
  handler: discountsController.get,
});

router.route({
  method: "get",
  path: "/api/v1/discounts",
  validate: {},
  handler: discountsController.getAll,
});

router.route({
  method: "put",
  path: "/api/v1/discounts/:id",
  validate: {
    type: "json",
    body: discountsRoutesValidation.put,
  },
  pre: checkAdmin,
  handler: discountsController.put,
});

router.route({
  method: "delete",
  path: "/api/v1/discounts/:id",
  validate: {},
  pre: checkAdmin,
  handler: discountsController.delete,
});

export default router.middleware();
