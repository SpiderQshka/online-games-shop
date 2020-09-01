import { User } from "./User";
import { Game } from "./Game";
import { Achievement } from "./Achievement";
import { GameCreator } from "./GameCreator";
import { Order } from "./Order";
import { Genre } from "./Genre";
import { Discount } from "./Discount";
import { UsedGenre } from "./UsedGenre";
import { UnlockedAchievement } from "./UnlockedAchievement";
import { OrderedGame } from "./OrderedGame";
import { UsedDiscount } from "./UsedDiscount";

export const Models = {
  users: {
    tableName: "users",
    model: User,
  },
  games: {
    tableName: "games",
    model: Game,
  },
  achievements: {
    tableName: "achievements",
    model: Achievement,
  },
  gameCreators: {
    tableName: "game_creators",
    model: GameCreator,
  },
  orders: {
    tableName: "orders",
    model: Order,
  },
  genres: {
    tableName: "genres",
    model: Genre,
  },
  discounts: {
    tableName: "discounts",
    model: Discount,
  },
  usedGenres: {
    tableName: "used_genres",
    model: UsedGenre,
  },
  unlockedAchievements: {
    tableName: "unlocked_achievements",
    model: UnlockedAchievement,
  },
  orderedGames: {
    tableName: "ordered_games",
    model: OrderedGame,
  },
  usedDiscounts: {
    tableName: "used_discounts",
    model: UsedDiscount,
  },
};
