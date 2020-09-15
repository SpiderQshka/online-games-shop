import koaRouter from "koa-joi-router";
import { usedGenresRoutesValidation } from "../routes-validation/usedGenres";
import { usedGenresController } from "../controllers/usedGenres";
import { checkAdmin } from "v1/auth";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/usedGenres",
  validate: {
    type: "json",
    body: usedGenresRoutesValidation.post,
  },
  pre: checkAdmin,
  handler: usedGenresController.post,
});

router.route({
  method: "get",
  path: "/api/v1/usedGenres/:id",
  validate: {},
  handler: usedGenresController.get,
});

router.route({
  method: "get",
  path: "/api/v1/usedGenres",
  validate: {},
  handler: usedGenresController.getAll,
});

router.route({
  method: "put",
  path: "/api/v1/usedGenres/:id",
  validate: {
    type: "json",
    body: usedGenresRoutesValidation.put,
  },
  pre: checkAdmin,
  handler: usedGenresController.put,
});

export default router.middleware();
