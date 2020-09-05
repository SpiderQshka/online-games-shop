import koaRouter from "koa-joi-router";
import { genresRoutesValidation } from "../routes-validation/genres";
import { genresController } from "../controllers/genres";
import { checkAdmin } from "v1/auth";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/genres",
  validate: {
    type: "json",
    body: genresRoutesValidation.post,
  },
  pre: checkAdmin,
  handler: genresController.post,
});

router.route({
  method: "get",
  path: "/api/v1/genres/:id",
  validate: {},
  handler: genresController.get,
});

router.route({
  method: "get",
  path: "/api/v1/genres",
  validate: {},
  handler: genresController.getAll,
});

router.route({
  method: "put",
  path: "/api/v1/genres/:id",
  validate: {
    type: "json",
    body: genresRoutesValidation.put,
  },
  pre: checkAdmin,
  handler: genresController.put,
});

router.route({
  method: "delete",
  path: "/api/v1/genres/:id",
  validate: {},
  pre: checkAdmin,
  handler: genresController.delete,
});

export default router.middleware();
