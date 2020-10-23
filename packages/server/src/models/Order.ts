import { Model } from "objection";

export class Order extends Model {
  id!: number;
  createdAt!: string;
  price!: number;
  status!: "pending" | "cancelled" | "received";
  static tableName = "orders";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["createdAt", "price"],
      properties: {
        id: { type: "integer" },
        createdAt: { type: "date" },
        price: { type: "number" },
      },
    };
  }
}
