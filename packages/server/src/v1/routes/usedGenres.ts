import koaRouter from "koa-joi-router";
import { usedGenresRoutesValidation } from "../routes-validation/usedGenres";
import { usedGenresController } from "../controllers/usedGenres";
const router = koaRouter();

router.route({
  method: "post",
  path: "/api/v1/usedGenres",
  validate: {
    type: "json",
    body: usedGenresRoutesValidation.post,
  },
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
  handler: usedGenresController.put,
});

router.route({
  method: "delete",
  path: "/api/v1/usedGenres/:id",
  validate: {},
  handler: usedGenresController.delete,
});

export default router.middleware();
