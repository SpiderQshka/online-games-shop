import { Context, Next, ParameterizedContext } from "koa";
import passport from "koa-passport";
import { FullHandler } from "koa-joi-router";
import { IUser } from "models/types";
import jwt from "jsonwebtoken";

export const checkAuth: FullHandler = async (ctx: Context, next: Next) => {
  return await passport.authenticate("jwt", (err, user, errObj) => {
    if (err || !user) ctx.throw(401, `Error: ${errObj.message}`);
    return next();
  })(ctx, next);
};

export const checkAdmin = async (ctx: Context, next: Next) => {
  return await passport.authenticate("jwt", (err, user, errObj) => {
    if (err || !user) ctx.throw(401, `Error: ${errObj.message}`);
    if (!user.isAdmin) ctx.throw(403, `Access denied`);
    return next();
  })(ctx, next);
};

export const verifyJwtToken = (ctx: ParameterizedContext) => {
  let user = {} as IUser;

  if (!ctx.request.header.token || !process.env.JWT_SECRET_KEY)
    ctx.throw(401, "Cannot find auth token or JWT key");

  try {
    user = jwt.verify(
      ctx.request.header.token,
      process.env.JWT_SECRET_KEY as string
    ) as IUser;
  } catch (e) {
    ctx.throw(401, "Cannot verify JWT token");
  }

  return user;
};
