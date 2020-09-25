import { IDiscount, IGameCreator, IGenre } from "./api";

export interface IGameForUI {
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
