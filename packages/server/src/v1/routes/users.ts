import Router from "koa-router";
import { usersController } from "../controllers/users";

const router = new Router();

router.get("/api/v1/users/:id", usersController.get);

router.post("/api/v1/users/login", usersController.login);
router.post("/api/v1/users", usersController.post);
router.put("/api/v1/users/:id", usersController.put);
router.delete("/api/v1/users/:id", usersController.delete);

export default router.routes();
