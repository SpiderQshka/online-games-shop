import passport from "koa-passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../../models/User";
import { config } from "../../config";

passport.use(
  new LocalStrategy(
    {
      usernameField: "login",
      passwordField: "password",
      session: false,
    },
    function (login, password, done) {
      User.query()
        .findOne({ login })
        .then((user) => {
          if (!user || !User.checkPassword(password, user.password))
            return done(true, false, { message: "(" });
          return done(null, user);
        });
    }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("token"),
  secretOrKey: config.jwtSecretKey,
};

passport.use(
  new JwtStrategy(jwtOptions, function (payload, done) {
    User.query()
      .findById(payload.id)
      .then((user) => {
        if (!user) return done(true, null, { message: "User not found" });
        return done(null, user);
      });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
