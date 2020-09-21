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
  getGames: () => Promise<{ games: IGame[]; error?: IApiError }>;
  getGame: (id: number) => Promise<{ game: IGame | null; error?: IApiError }>;
  getGameCreators: () => Promise<{
    gameCreators: IGameCreator[];
    error?: IApiError;
  }>;
  getGameCreator: (
    id: number
  ) => Promise<{ gameCreator: IGameCreator | null; error?: IApiError }>;
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
    achievements: IAchievement[];
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
  id: number;
  createdAt: string;
  price: number;
}

export interface IGame {
  id: number;
  name: string;
  logo: string;
  description: string;
  ageRating: number;
  price: number;
  numberOfPhysicalCopies: number;
  gameCreatorId: number;
  creationDate: string;
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
  id: number;
  name: string;
  discount: number;
}
