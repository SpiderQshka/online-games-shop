import { Middleware } from "koa";
import knex from "../../db/knex";
import { Model } from "objection";
import { User } from "../../models/User";
import passport from "koa-passport";
import jwt from "jsonwebtoken";
import { config } from "../../config";

Model.knex(knex);

interface IUsersController {
  login: Middleware;
  get: Middleware;
  put: Middleware;
  post: Middleware;
  delete: Middleware;
}

export const usersController: IUsersController = {
  login: async (ctx, next) => {
    await passport.authenticate("local", (err, user) => {
      if (err) {
        ctx.body = "Login failed";
      } else {
        const payload = {
          ...user,
        };
        const token = jwt.sign(payload, config.jwtSecretKey);

        ctx.body = { user: user.id, token };
      }
    })(ctx, next);
  },
  get: async (ctx) => {
    const result = await User.query().findById(ctx.params.id);

    ctx.body = result;
  },
  put: async (ctx) => {
    const body = ctx.request.body;

    const result = await User.query()
      .findById(ctx.params.id)
      .patchAndFetchById(ctx.params.id, body);

    ctx.body = result;
  },
  post: async (ctx) => {
    const body = ctx.request.body;

    const result = await User.query().insert({
      ...body,
    });

    ctx.body = result;
  },
  delete: async (ctx) => {
    const result = await User.query().deleteById(ctx.params.id);
    ctx.body = result;
  },
};
