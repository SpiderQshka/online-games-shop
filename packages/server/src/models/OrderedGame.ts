import { Model } from "objection";
import { User } from "./User";
import { Game } from "./Game";
import { Order } from "./Order";

export class OrderedGame extends Model {
  id!: number;
  orderId!: string;
  userId!: string;
  gameId!: string;
  price!: string;

  static tableName = "ordered_games";
  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "uuid" },
        price: { type: "number" },
      },
    };
  }
  static relationMappings = {
    orderId: {
      relation: Model.BelongsToOneRelation,
      modelClass: Order,
      join: {
        from: "ordered_games.orderId",
        to: "orders.id",
      },
    },
    userId: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "ordered_games.userId",
        to: "users.id",
      },
    },
    gameId: {
      relation: Model.BelongsToOneRelation,
      modelClass: Game,
      join: {
        from: "ordered_games.gameId",
        to: "games.id",
      },
    },
  };
}
