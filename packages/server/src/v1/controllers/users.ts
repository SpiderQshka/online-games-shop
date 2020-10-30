import { Middleware } from "koa";
import knex from "db/knex";
import { Model, UniqueViolationError } from "objection";
import { User } from "models/User";
import { hashPassword } from "models/helpers";
import jwt from "jsonwebtoken";
import { verifyJwtToken } from "v1/auth";

Model.knex(knex);

interface IUsersController {
  get: Middleware;
  getAll: Middleware;
  getMy: Middleware;
  put: Middleware;
  post: Middleware;
}

export const usersController: IUsersController = {
  get: async (ctx) => {
    const user = verifyJwtToken(ctx);

    const response = await User.query().findById(ctx.params.id);

    if (!response)
      ctx.throw(404, `User with id '${ctx.params.id}' was not found`);

    if (user.id !== ctx.params.id && !user.isAdmin)
      ctx.throw(403, `Access denied`);

    ctx.body = response;
  },
  getAll: async (ctx) => {
    const response = await User.query();

    if (!response) ctx.throw(404, `No users found`);

    ctx.body = response;
  },
  getMy: async (ctx) => {
    const user = verifyJwtToken(ctx);

    ctx.body = user;
  },
  put: async (ctx) => {
    const response = await User.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, ctx.request.body);

    if (!response)
      ctx.throw(404, `User with id '${ctx.params.id}' was not found`);

    ctx.body = response;
  },
  post: async (ctx) => {
    try {
      const response = await User.query().insert({
        ...ctx.request.body,
        password: await hashPassword(ctx.request.body.password),
      });

      const token = jwt.sign(
        response.toJSON(),
        process.env.JWT_SECRET_KEY as string
      );

      ctx.body = { user: response, token };
    } catch (e) {
      console.log(e);

      if (e instanceof UniqueViolationError)
        ctx.throw(400, "Login is already taken");

      ctx.throw(400, "Bad request");
    }
  },
};
