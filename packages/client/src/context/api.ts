import { createContext, useContext } from "react";
import {
  IAchievement,
  IAchievementFromApi,
  IApiError,
  IDiscount,
  IDiscountFromApi,
  IGame,
  IGameCreator,
  IGameCreatorFromApi,
  IGameFromApi,
  IGenre,
  IGenreFromApi,
  IMyAchievementFromApi,
  IMyGameFromApi,
  IOrder,
  IOrderAdmin,
  IOrderedGame,
  IOrderFromApi,
  IUsedDiscount,
  IUsedGenre,
  IUser,
} from "interfaces/api";
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
    achievements: IMyAchievementFromApi[];
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
  getUserGames: () => Promise<{
    games: IMyGameFromApi[];
    error?: IApiError;
  }>;
  queryGame: (
    query: string
  ) => Promise<{
    games: IGameFromApi[];
    error?: IApiError;
  }>;
}

export const ApiContext = createContext<IApi>({} as IApi);

export function useApi() {
  return useContext(ApiContext);
}
