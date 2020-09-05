import { Model } from "objection";

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
