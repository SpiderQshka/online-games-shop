import { Model } from "objection";

export class UsedDiscount extends Model {
  id!: number;
  discountId!: number;
  gameId!: number;

  static tableName = "used_discounts";
  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        discountId: { type: "integer" },
        gameId: { type: "integer" },
      },
    };
  }
}
