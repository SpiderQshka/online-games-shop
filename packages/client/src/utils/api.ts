import axios from "axios";
import { config } from "config";
import { IOrder, IApiError, IApi, IOrderFromApi } from "interfaces/api";

export const API: IApi = {
  postOrder: (order: IOrder) =>
    axios
      .post(`${config.apiUrl}/orders`, order)
      .then((response) => {
        console.log(response);
        return { response: {} as IOrderFromApi };
      })
      .catch((error: IApiError) => {
        console.log(error);
        return { response: null, error: {} as IApiError };
      }),
  login: (data) =>
    axios
      .post(`${config.apiUrl}/login`, data)
      .then((response) => {
        console.log(response);
        return { token: response.data.token };
      })
      .catch((error: IApiError) => {
        console.log(error);
        return { token: null, error: {} as IApiError };
      }),
};
