import { Model } from "objection";

export class Achievements extends Model {
  id!: number;
  name!: string;
  static tableName = "achievements";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        id: { type: "uuid" },
        name: { type: "string" },
      },
    };
  }
}
