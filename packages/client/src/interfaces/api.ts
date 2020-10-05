import { LoginFormValues } from "pages/Login";

export interface IApi {
  postOrder: (
    order: IOrder
  ) => Promise<{ order: IOrderFromApi | null; error?: IApiError }>;
  login: (
    data: LoginFormValues
  ) => Promise<{ token: string | null; error?: IApiError }>;
  register: (
    data: LoginFormValues
  ) => Promise<{ token: string | null; error?: IApiError }>;
  getGames: () => Promise<{ games: IGameFromApi[]; error?: IApiError }>;
  getGame: (
    id: number
  ) => Promise<{ game: IGameFromApi | null; error?: IApiError }>;
  getGameCreators: () => Promise<{
    gameCreators: IGameCreatorFromApi[];
    error?: IApiError;
  }>;
  getGameCreator: (
    id: number
  ) => Promise<{ gameCreator: IGameCreatorFromApi | null; error?: IApiError }>;
  getDiscounts: () => Promise<{
    discounts: IDiscount[];
    error?: IApiError;
  }>;
  getUsedDiscounts: () => Promise<{
    usedDiscounts: IUsedDiscount[];
    error?: IApiError;
  }>;
  getGenres: () => Promise<{
    genres: IGenre[];
    error?: IApiError;
  }>;
  getUsedGenres: () => Promise<{
    usedGenres: IUsedGenre[];
    error?: IApiError;
  }>;
  getUserOrders: () => Promise<{
    orders: IOrderFromApi[];
    error?: IApiError;
  }>;
  getUserOrderedGames: () => Promise<{
    orderedGames: IOrderedGame[];
    error?: IApiError;
  }>;
  getUserAchievements: () => Promise<{
    achievements: IAchievementFromApi[];
    error?: IApiError;
  }>;
  getUser: () => Promise<{
    user: IUser | null;
    error?: IApiError;
  }>;
  getOrders: () => Promise<{
    orders: IOrderFromApi[];
    error?: IApiError;
  }>;
  getOrderedGames: () => Promise<{
    orderedGames: IOrderedGame[];
    error?: IApiError;
  }>;
  putOrder: (
    id: number,
    order: IOrder
  ) => Promise<{ order: IOrderFromApi | null; error?: IApiError }>;
  postOrderAdmin: (
    order: IOrderAdmin
  ) => Promise<{ order: IOrderFromApi | null; error?: IApiError }>;
  getUsers: () => Promise<{ users: IUser[]; error?: IApiError }>;
  postGame: (
    game: IGame
  ) => Promise<{ game: IGameFromApi | null; error?: IApiError }>;
  putGame: (
    id: number,
    game: IGame
  ) => Promise<{ game: IGameFromApi | null; error?: IApiError }>;
  postGameCreator: (
    gameCreator: IGameCreator
  ) => Promise<{ gameCreator: IGameCreatorFromApi | null; error?: IApiError }>;
  putGameCreator: (
    id: number,
    gameCreator: IGameCreator
  ) => Promise<{ gameCreator: IGameCreatorFromApi | null; error?: IApiError }>;
  getAchievements: () => Promise<{
    achievements: IAchievementFromApi[];
    error?: IApiError;
  }>;
  postAchievement: (
    achievement: IAchievement
  ) => Promise<{ achievement: IAchievementFromApi | null; error?: IApiError }>;
  putAchievement: (
    id: number,
    achievement: IAchievement
  ) => Promise<{ achievement: IAchievementFromApi | null; error?: IApiError }>;
}

export interface IApiError {
  status: number;
  msg: string;
}

export interface IUser {
  id: number;
  login: string;
  password: string;
  isAdmin: boolean;
}

export interface IOrder {
  gamesIds: number[];
  status: OrderStatus;
}

export interface IOrderPut extends IOrder {
  id: number;
}

export interface IOrderAdmin extends IOrder {
  userId: number;
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
}

export interface IGamePut extends IGame {
  id: number;
}

export interface IGameFromApi {
  id: number;
  name: string;
  logo: string;
  description: string;
  ageRating: number;
  price: number;
  numberOfPhysicalCopies: number;
  gameCreatorId: number;
  createdAt: string;
}

export interface IGameCreator {
  name: string;
  logo: string;
  yearOfFoundation: number;
}

export interface IGameCreatorPut extends IGameCreator {
  id: number;
}

export interface IGameCreatorFromApi extends IGameCreator {
  id: number;
}

export interface IDiscount {
  id: number;
  startDate: Date;
  endDate: Date;
  amount: number;
  type: string;
}

export interface IUsedDiscount {
  id: number;
  discountId: number;
  gameId: number;
}

export interface IGenre {
  id: number;
  name: string;
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
}

export interface IAchievement {
  name: string;
  discount: number;
}

export interface IAchievementFromApi extends IAchievement {
  id: number;
}
