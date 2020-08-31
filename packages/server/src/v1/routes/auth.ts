import { usersController } from "../controllers/users";
import koaRouter from "koa-joi-router";
import { usersRoutesValidation } from "../routes-validation/users";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/login",
  validate: {
    type: "json",
    body: usersRoutesValidation.post,
  },
  handler: usersController.login,
});

export default router.middleware();
