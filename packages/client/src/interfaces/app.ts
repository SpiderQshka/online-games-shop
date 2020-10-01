import {
  IDiscount,
  IGameCreator,
  IGameFromApi,
  IGenre,
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
  gameCreator: IGameCreator;
  createdAt: string;
  genres: IGenre[];
  discount: IDiscount | null;
}

export interface IOrderForUI extends IOrderFromApi {
  orderedGames: IGameFromApi[];
}
