import { Middleware } from "koa";
import knex from "db/knex";
import { Model } from "objection";
import passport from "koa-passport";
import jwt from "jsonwebtoken";

Model.knex(knex);

interface IAuthController {
  login: Middleware;
}

export const authController: IAuthController = {
  login: async (ctx, next) => {
    await passport.authenticate("local", (err, user) => {
      if (err) ctx.throw(400, "Wrong credential provided");

      if (!process.env.JWT_SECRET_KEY)
        ctx.throw(400, "Cannot find jwt secret key");

      const token = jwt.sign(user, process.env.JWT_SECRET_KEY as string);

      ctx.body = { user, token };
    })(ctx, next);
  },
};
