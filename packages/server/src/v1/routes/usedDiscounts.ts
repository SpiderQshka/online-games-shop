import koaRouter from "koa-joi-router";
import { usedDiscountsRoutesValidation } from "../routes-validation/usedDiscounts";
import { usedDiscountsController } from "../controllers/usedDiscounts";
import { checkAdmin } from "v1/auth";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/usedDiscounts",
  validate: {
    type: "json",
    body: usedDiscountsRoutesValidation.post,
  },
  pre: checkAdmin,
  handler: usedDiscountsController.post,
});

router.route({
  method: "get",
  path: "/api/v1/usedDiscounts/:id",
  validate: {},
  handler: usedDiscountsController.get,
});

router.route({
  method: "get",
  path: "/api/v1/usedDiscounts",
  validate: {},
  handler: usedDiscountsController.getAll,
});

router.route({
  method: "put",
  path: "/api/v1/usedDiscounts/:id",
  validate: {
    type: "json",
    body: usedDiscountsRoutesValidation.put,
  },
  pre: checkAdmin,
  handler: usedDiscountsController.put,
});

router.route({
  method: "delete",
  path: "/api/v1/usedDiscounts/:id",
  validate: {},
  pre: checkAdmin,
  handler: usedDiscountsController.delete,
});

export default router.middleware();
