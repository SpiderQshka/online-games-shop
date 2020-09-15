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
