import { Context, Next } from "koa";
import passport from "koa-passport";

export const checkAuth = async (ctx: Context, next: Next) => {
  return await passport.authenticate("jwt", (err, user, errObj) => {
    if (err || !user) return (ctx.body = `Error: ${errObj.message}`);
    else return next();
  })(ctx, next);
};

export const checkAdmin = async (ctx: Context, next: Next) => {
  return await passport.authenticate("jwt", (err, user, errObj) => {
    if (err || !user) return (ctx.body = `Error: ${errObj.message}`);
    else if (!user.isAdmin) return (ctx.body = "Access denied");
    else return next();
  })(ctx, next);
};
