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
    discounts: IDiscountFromApi[];
    error?: IApiError;
  }>;
  getUsedDiscounts: () => Promise<{
    usedDiscounts: IUsedDiscount[];
    error?: IApiError;
  }>;
  getGenres: () => Promise<{
    genres: IGenreFromApi[];
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
  postDiscount: (
    discount: IDiscount
  ) => Promise<{ discount: IDiscountFromApi | null; error?: IApiError }>;
  putDiscount: (
    id: number,
    discount: IDiscount
  ) => Promise<{ discount: IDiscountFromApi | null; error?: IApiError }>;
  postGenre: (
    genre: IGenre
  ) => Promise<{ genre: IGenreFromApi | null; error?: IApiError }>;
  putGenre: (
    id: number,
    genre: IGenre
  ) => Promise<{ genre: IGenreFromApi | null; error?: IApiError }>;
  blockGame: (
    id: number
  ) => Promise<{ game: IGameFromApi | null; error?: IApiError }>;
  unblockGame: (
    id: number
  ) => Promise<{ game: IGameFromApi | null; error?: IApiError }>;
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

export interface IGameFromApi extends IGame {
  id: number;
}

export interface IGameForOrder extends IGameFromApi {
  isPhysical: boolean;
  discount: IDiscountFromApi | null;
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
