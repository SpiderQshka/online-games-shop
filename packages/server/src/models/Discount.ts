import { Model } from "objection";

export class Discount extends Model {
  id!: number;
  startDate!: string;
  endDate!: string;
  amount!: number;
  type!: "%" | "$";
  static tableName = "discounts";
  static get jsonSchema() {
    return {
      type: "object",
      required: ["startDate", "endDate", "amount", "type"],
      properties: {
        id: { type: "integer" },
        startDate: { type: "date" },
        endDate: { type: "date" },
        amount: { type: "number" },
        type: { type: "string" },
      },
    };
  }
}
