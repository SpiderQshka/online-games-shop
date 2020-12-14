export type ResourceType =
  | "games"
  | "orders"
  | "auth"
  | "users"
  | "genres"
  | "discounts"
  | "achievements"
  | "gameCreators"
  | "usedDiscounts"
  | "usedGenres"
  | "orderedGames";

export interface IApiError {
  status: number;
  msg: string;
  resource: ResourceType;
}

export interface IUser {
  id: number;
  login: string;
  password: string;
  isAdmin: boolean;
}

export interface IOrder {
  gamesIds: number[];
  physicalGamesCopiesIds: number[];
  status: OrderStatus;
}

export interface IOrderAdmin extends IOrder {
  userId: number;
  physicalGamesCopiesIds: number[];
}

export type OrderStatus = "pending" | "cancelled" | "received";
export interface IOrderFromApi {
  id: number;
  createdAt: string;
  price: number;
  status: OrderStatus;
}

export interface IGame {
  name: string;
  logo: string;
  description: string;
  ageRating: number;
  price: number;
  numberOfPhysicalCopies: number;
  gameCreatorId: number;
  createdAt: string;
  genresIds: number[];
  physicalCopyPrice: number;
}

export interface IGamePut {
  name: string;
  logo?: string;
  description: string;
  ageRating: number;
  price: number;
  numberOfPhysicalCopies: number;
  gameCreatorId: number;
  createdAt: string;
  genresIds: number[];
  physicalCopyPrice: number;
}

export interface IGameFromApi extends IGame {
  id: number;
}

export interface IMyGameFromApi extends IGameFromApi {
  isPhysical: boolean;
}

export interface IGameForOrder extends IMyGameFromApi {
  discount: IDiscountFromApi | null;
  dublicatesNumber: number;
}

export interface IGameCreator {
  name: string;
  logo: string;
  yearOfFoundation: number;
}

export interface IGameCreatorFromApi extends IGameCreator {
  id: number;
}

export interface IGameCreatorPut {
  name: string;
  logo?: string;
  yearOfFoundation: number;
}

export interface IDiscount {
  startDate: string;
  endDate: string;
  amount: number;
  type: "%" | "$";
  gamesIds: number[];
}

export interface IDiscountFromApi {
  id: number;
  startDate: string;
  endDate: string;
  amount: number;
  type: "%" | "$";
}

export interface IUsedDiscount {
  id: number;
  discountId: number;
  gameId: number;
}

export interface IGenre {
  name: string;
}

export interface IGenreFromApi extends IGenre {
  id: number;
}

export interface IUsedGenre {
  id: number;
  genreId: number;
  gameId: number;
}

export interface IOrderedGame {
  id: number;
  orderId: number;
  userId: number;
  gameId: number;
  price: number;
  isPhysical: boolean;
}

export interface IAchievement {
  name: string;
  discount: number;
}

export interface IAchievementFromApi extends IAchievement {
  id: number;
}

export interface IMyAchievementFromApi extends IAchievementFromApi {
  seen: boolean;
}

export interface IUnlockedAchievement {
  achievementId: number;
  userId: number;
}

export interface IUnlockedAchievementFromApi extends IUnlockedAchievement {
  id: number;
}
