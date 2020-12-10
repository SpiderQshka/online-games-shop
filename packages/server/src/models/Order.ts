import { Model } from "objection";

export type OrderStatus = "pending" | "cancelled" | "received";

export class Order extends Model {
  id!: number;
  createdAt!: string;
  price!: number;
  status!: OrderStatus;
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
