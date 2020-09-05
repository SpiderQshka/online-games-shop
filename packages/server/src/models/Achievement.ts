import { Model } from "objection";

export interface IAchievement {
  id: number;
  name: string;
}

export class Achievement extends Model {
  id!: number;
  name!: string;
  static tableName = "achievements";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
      },
    };
  }
}
