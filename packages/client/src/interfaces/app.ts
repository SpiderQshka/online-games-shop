import {
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
}

export interface IOrderForUI extends IOrderFromApi {
  orderedGames: IGameForOrder[];
}

export interface OrderWithUserId extends IOrderForUI {
  userId: number;
}

export interface IDiscountForUI extends IDiscountFromApi {
  games: IGameFromApi[];
}
