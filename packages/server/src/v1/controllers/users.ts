import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import { User } from "models/User";
import { hashPassword } from "models/helpers";

Model.knex(knex);

interface IUsersController {
  get: Middleware;
  getAll: Middleware;
  put: Middleware;
  post: Middleware;
}

export const usersController: IUsersController = {
  get: async (ctx) => {
    try {
      const response = await User.query().findById(ctx.params.id);

      if (!response) ctx.throw(404);

      ctx.body = response;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(404, `User with id '${ctx.params.id}' was not found`);

        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  getAll: async (ctx) => {
    const response = await User.query();

    if (!response) ctx.throw(404, `No users found`);

    ctx.body = response;
  },
  put: async (ctx) => {
    try {
      const response = await User.query()
        .findById(ctx.params.id)
        .patchAndFetchById(ctx.params.id, ctx.request.body);

      if (!response) ctx.throw(404);

      ctx.body = response;
    } catch (e) {
      switch (e.status) {
        case 404:
          ctx.throw(404, `User with id '${ctx.params.id}' was not found`);

        default:
          ctx.throw(400, "Bad request");
      }
    }
  },
  post: async (ctx) => {
    try {
      const response = await User.query().insert({
        ...ctx.request.body,
        password: hashPassword(ctx.request.body.password),
      });

      ctx.body = response;
    } catch (e) {
      ctx.throw(400, "Bad request");
    }
  },
};
