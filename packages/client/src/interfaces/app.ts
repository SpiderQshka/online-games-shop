import {
  IDiscountFromApi,
  IGameCreatorFromApi,
  IGameFromApi,
  IGenreFromApi,
  IOrderFromApi,
} from "./api";

export interface IGameForUI {
  id: number;
  name: string;
  logo: string;
  description: string;
  ageRating: number;
  price: number;
  numberOfPhysicalCopies: number;
  gameCreator: IGameCreatorFromApi;
  createdAt: string;
  genres: IGenreFromApi[];
  discount: IDiscountFromApi | null;
}

export interface IOrderForUI extends IOrderFromApi {
  orderedGames: IGameFromApi[];
}

export interface OrderWithUserId extends IOrderForUI {
  userId: number;
}

export interface IDiscountForUI extends IDiscountFromApi {
  games: IGameFromApi[];
}
