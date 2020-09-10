import { createContext, useContext } from "react";
import { IApi } from "interfaces/api";

export const ApiContext = createContext<IApi>({} as IApi);

export function useApi() {
  return useContext(ApiContext);
}
