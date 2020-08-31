import { authController } from "../controllers/auth";
import koaRouter from "koa-joi-router";
import { authRoutesValidation } from "v1/routes-validation/auth";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/login",
  validate: {
    type: "json",
    body: authRoutesValidation.post,
  },
  handler: authController.login,
});

export default router.middleware();
