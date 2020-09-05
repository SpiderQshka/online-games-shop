import { Model } from "objection";

export class Discount extends Model {
  id!: number;
  startDate!: Date;
  duration!: number;
  amount!: number;
  type!: string;
  static tableName = "discounts";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["startDate", "duration", "amount"],
      properties: {
        id: { type: "integer" },
        startDate: { type: "date" },
        duration: { type: "number" },
        amount: { type: "number" },
        type: { type: "string" },
      },
    };
  }
}
