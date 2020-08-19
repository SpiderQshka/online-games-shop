import { Middleware } from "koa";
import knex from "../../db/knex";

interface IUsersController {
  login: Middleware;
  get: Middleware;
  put: Middleware;
  post: Middleware;
  delete: Middleware;
}

export const usersController: IUsersController = {
  login: async (ctx) => {
    ctx.body = "Login user";
  },
  get: async (ctx) => {
    const result = await knex.select().from("users").where("id", ctx.params.id);

    ctx.body = result;
  },
  put: async (ctx) => {
    const result = await knex("users").where("id", ctx.params.id).update({
      login: "Updated!",
    });
    ctx.body = result;
  },
  post: async (ctx) => {
    const result = await knex("users").insert({
      login: "Test",
      password: "testtest",
      boughtGames: [],
      achievements: [],
    });
    ctx.body = result;
  },
  delete: async (ctx) => {
    const result = await knex("users").where("id", ctx.params.id).del();
    ctx.body = result;
  },
};
