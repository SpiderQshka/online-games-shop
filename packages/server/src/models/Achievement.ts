import { Model } from "objection";

export type AchievementName = "Buy 1 game" | "Buy 2 games" | "Buy 10 games";

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
