import { Model } from "objection";

export class Achievement extends Model {
  id!: number;
  name!: string;
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
