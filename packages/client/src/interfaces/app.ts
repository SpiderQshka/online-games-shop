import { IDiscount, IGameCreator, IGenre } from "./api";

export interface IStoreGame {
  id: number;
  name: string;
  logo: string;
  description: string;
  ageRating: number;
  price: number;
  numberOfPhysicalCopies: number;
  gameCreator: IGameCreator;
  creationDate: string;
  genres: IGenre[];
  discount: IDiscount | null;
}
