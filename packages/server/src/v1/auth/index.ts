import { Context, Next } from "koa";
import passport from "koa-passport";

export const checkAuth = async (ctx: Context, next: Next) => {
  return await passport.authenticate("jwt", (err, user, errObj) => {
    if (err || !user) ctx.throw(401, `Error: ${errObj.message}`);
    next();
  })(ctx, next);
};

export const checkAdmin = async (ctx: Context, next: Next) => {
  return await passport.authenticate("jwt", (err, user, errObj) => {
    if (err || !user) ctx.throw(401, `Error: ${errObj.message}`);
    if (!user.isAdmin) ctx.throw(403, `Access denied`);
    next();
  })(ctx, next);
};
