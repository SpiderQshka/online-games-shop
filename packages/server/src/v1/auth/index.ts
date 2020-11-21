import { Context, Next, ParameterizedContext } from "koa";
import passport from "koa-passport";
import { FullHandler } from "koa-joi-router";
import { IUser } from "models/types";
import jwt from "jsonwebtoken";

export const checkAuth: FullHandler = (ctx: Context, next: Next) =>
  passport.authenticate("jwt", (err, user) => {
    if (err || !user) ctx.throw(401, `Can't find this user`);
    return next();
  })(ctx, next);

export const checkAdmin = (ctx: Context, next: Next) =>
  passport.authenticate("jwt", (err, user, errObj) => {
    if (err || !user) ctx.throw(401, `Can't find this user`);
    if (!user.isAdmin) ctx.throw(403, `Access denied`);
    return next();
  })(ctx, next);

export const verifyJwtToken = (ctx: ParameterizedContext) => {
  if (!ctx.request.header.token || !process.env.JWT_SECRET_KEY)
    ctx.throw(401, "Cannot find auth token or JWT key");

  try {
    const user = jwt.verify(
      ctx.request.header.token,
      process.env.JWT_SECRET_KEY as string
    ) as IUser;

    return user;
  } catch (e) {
    ctx.throw(401, "Cannot verify JWT token");
  }
};
