import {
  IApiError,
  IDiscountFromApi,
  IGameCreatorFromApi,
  IGameForOrder,
  IGameFromApi,
  IGenreFromApi,
  IOrderFromApi,
} from "./api";

export interface IGameForUI extends IGameFromApi {
  gameCreator: IGameCreatorFromApi;
  genres: IGenreFromApi[];
  discount: IDiscountFromApi | null;
  optimalPrice: number;
  physicalCopyOptimalPrice: number;
}

export interface IOrderForUI extends IOrderFromApi {
  orderedGames: IGameForOrder[];
}

export interface IOrderWithUserId extends IOrderForUI {
  userId: number;
}

export interface IDiscountForUI extends IDiscountFromApi {
  games: IGameFromApi[];
}

export interface IErrorObject {
  games: IApiError | null;
  orders: IApiError | null;
  auth: IApiError | null;
  users: IApiError | null;
  genres: IApiError | null;
  discounts: IApiError | null;
  achievements: IApiError | null;
  gameCreators: IApiError | null;
  usedDiscounts: IApiError | null;
  usedGenres: IApiError | null;
  orderedGames: IApiError | null;
}

export const defaultErrorObj = {
  achievements: null,
  auth: null,
  discounts: null,
  gameCreators: null,
  games: null,
  genres: null,
  orderedGames: null,
  orders: null,
  usedDiscounts: null,
  usedGenres: null,
  users: null,
};
