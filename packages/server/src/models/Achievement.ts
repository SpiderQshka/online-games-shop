import { Model } from "objection";

export type AchievementName =
  | "Buy 1 game"
  | "Buy 2 games"
  | "Buy 10 games"
  | "Make 1 order"
  | "Make 2 orders"
  | "Make 10 orders"
  | "Order 1 physical copy"
  | "Order 2 physical copies"
  | "Order 10 physical copies";

export class Achievement extends Model {
  id!: number;
  name!: AchievementName;
  discount!: number;
  static tableName = "achievements";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
        discount: { type: "number" },
      },
    };
  }
}
