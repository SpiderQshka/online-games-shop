import { Model } from "objection";
import { OrderedGame } from "./OrderedGame";
import { ParameterizedContext } from "koa";
import { processArrayAsync } from "v1/helpers";
import { Game } from "./Game";
import { IGame, IOrderedGame, IOrder } from "./types";
import { verifyJwtToken } from "v1/auth";

export class Order extends Model {
  id!: number;
  createdAt!: Date;
  price!: number;
  static tableName = "orders";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["createdAt", "price"],
      properties: {
        id: { type: "integer" },
        createdAt: { type: "date" },
        price: { type: "number" },
      },
    };
  }
  static delete = async (ctx: ParameterizedContext) => {
    let response;

    try {
      await OrderedGame.query().where("orderId", ctx.params.id).delete();
      response = await Order.query().deleteById(ctx.params.id);
    } catch (error) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(404, `Order with id '${ctx.params.id}' was not found`);

    return response;
  };
  static get = async (ctx: ParameterizedContext) => {
    let response;

    try {
      response = await Order.query().findById(ctx.params.id);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(404, `Order with id '${ctx.params.id}' was not found`);

    return response;
  };
  static getAll = async (ctx: ParameterizedContext) => {
    let response;

    try {
      response = await Order.query();
    } catch (e) {
      ctx.throw(500, "Server error");
    }

    if (!response) ctx.throw(404, `No orders found`);

    return response;
  };
  static create = async (ctx: ParameterizedContext) => {
    const gamesIds = ctx.request.body.games as number[];
    let games: IGame[];
    let order: IOrder;
    let orderedGames: IOrderedGame[];

    const user = verifyJwtToken(ctx);

    try {
      games = await processArrayAsync(
        gamesIds,
        async (id) => await Game.query().findById(id)
      );

      const price = games.reduce((prev, curr) => prev + +curr.price, 0);

      order = await Order.query().insert({
        createdAt: new Date(),
        price,
      });

      orderedGames = await processArrayAsync(
        games,
        async (game) =>
          await OrderedGame.query().insert({
            gameId: game.id,
            orderId: order.id,
            userId: user.id,
            price: +game.price,
          })
      );
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    return orderedGames;
  };
  static put = async (ctx: ParameterizedContext) => {
    let response;

    try {
      response = await Order.query()
        .findById(ctx.params.id)
        .patchAndFetchById(ctx.params.id, ctx.request.body);
    } catch (e) {
      ctx.throw(400, "Bad request");
    }

    if (!response)
      ctx.throw(404, `Order with id '${ctx.params.id}' was not found`);

    return response;
  };
}
