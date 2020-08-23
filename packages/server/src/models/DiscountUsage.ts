import { Model } from "objection";
import { Game } from "./Game";
import { Discount } from "./Discount";

export class DiscountUsage extends Model {
  id!: number;
  discountId!: string;
  gameId!: string;

  static tableName = "discounts_usage";
  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "uuid" },
      },
    };
  }
  static relationMappings = {
    discountId: {
      relation: Model.BelongsToOneRelation,
      modelClass: Discount,
      join: {
        from: "discounts_usage.discountId",
        to: "discounts.id",
      },
    },
    gameId: {
      relation: Model.BelongsToOneRelation,
      modelClass: Game,
      join: {
        from: "discounts_usage.gameId",
        to: "games.id",
      },
    },
  };
}
