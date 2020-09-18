import { LoginFormValues } from "pages/Login";

export interface IApi {
  postOrder: (
    order: IOrder
  ) => Promise<{ response: IOrderFromApi | null; error?: IApiError }>;
  login: (
    data: LoginFormValues
  ) => Promise<{ token: string | null; error?: IApiError }>;
  register: (
    data: LoginFormValues
  ) => Promise<{ token: string | null; error?: IApiError }>;
  getGames: () => Promise<{ games: IGame[] | null; error?: IApiError }>;
  getGameCreators: () => Promise<{
    gameCreators: IGameCreator[] | null;
    error?: IApiError;
  }>;
  getDiscounts: () => Promise<{
    discounts: IDiscount[] | null;
    error?: IApiError;
  }>;
}

export interface IApiError {
  status: number;
  msg: string;
}

export interface IOrder {
  games: number[];
}

export interface IOrderFromApi {
  games: number[];
}

export interface IGame {
  id: number;
  name: string;
  logo: string;
  description: string;
  ageRating: number;
  price: number;
  numberOfPhysicalCopies: number | null;
  gameCreatorId: number;
}

export interface IGameCreator {
  id: number;
  name: string;
  logo: string;
  yearOfFoundation: number;
}

export interface IDiscount {
  id: number;
  startDate: Date;
  duration: number;
  amount: number;
  type: string;
}
