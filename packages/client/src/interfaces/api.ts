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
  getUser: () => Promise<{
    user: IUser | null;
    error?: IApiError;
  }>;
  getOrders: () => Promise<{
    orders: IOrder[];
    error?: IApiError;
  }>;
  getOrderedGames: () => Promise<{
    orderedGames: IOrderedGame[];
    error?: IApiError;
  }>;
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
}

export interface IOrderFromApi {
  id: number;
  createdAt: string;
  price: number;
  orderedGames: IGame[];
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
