import { Model } from "objection";
// import { User } from "./User";
// import { Achievement } from "./Achievement";

export class UnlockedAchievement extends Model {
  id!: number;
  achievementId!: string;
  userId!: string;
  static tableName = "unlocked_achievements";
  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        achievementId: { type: "integer" },
        userId: { type: "integer" },
      },
    };
  }
  // static relationMappings = {
  //   achievementId: {
  //     relation: Model.BelongsToOneRelation,
  //     modelClass: Achievement,
  //     join: {
  //       from: "unlocked_achievements.achievementId",
  //       to: "achievements.id",
  //     },
  //   },
  //   userId: {
  //     relation: Model.BelongsToOneRelation,
  //     modelClass: User,
  //     join: {
  //       from: "unlocked_achievements.userId",
  //       to: "users.id",
  //     },
  //   },
  // };
}
