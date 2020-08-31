import { Model } from "objection";

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
        createdAt: { type: "string", format: "date" },
        price: { type: "number" },
      },
    };
  }
}
