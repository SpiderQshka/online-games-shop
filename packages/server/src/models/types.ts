export interface IAchievement {
  id: number;
  name: string;
}

export interface IDiscount {
  id: number;
  startDate: string;
  endDate: string;
  amount: number;
  type: "%" | "$";
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
  physicalCopyPrice: number;
}

export interface IGameCreator {
  id: number;
  name: string;
  logo: string;
  yearOfFoundation: number;
}

export interface IGenre {
  id: number;
  name: string;
}

export interface IOrder {
  id: number;
  createdAt: Date;
  price: number;
}

export interface IOrderedGame {
  id: number;
  orderId: number;
  userId: number;
  gameId: number;
  price: number;
  isPhysical: boolean;
}

export interface IUnlockedAchievement {
  id: number;
  achievementId: number;
  userId: number;
}

export interface IUsedDiscount {
  id: number;
  discountId: number;
  gameId: number;
  isPhysical: boolean;
}

export interface IUsedGenre {
  id: number;
  genreId: number;
  gameId: number;
}

export interface IUser {
  id: number;
  login: string;
  password: string;
  isAdmin: boolean;
}
