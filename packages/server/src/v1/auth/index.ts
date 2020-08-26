import { Context, Next } from "koa";
import passport from "koa-passport";

export const checkAuth = async (ctx: Context, next: Next) => {
  return await passport.authenticate("jwt", (err, user, errObj) => {
    if (err || !user) return (ctx.body = `Err: ${errObj.message}`);
    else return next();
  })(ctx, next);
};
