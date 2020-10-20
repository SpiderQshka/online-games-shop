import { createContext, useContext } from "react";

export interface IAuth {
  token: string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
}

export const AuthContext = createContext<IAuth>({} as IAuth);

export function useAuth() {
  return useContext(AuthContext);
}
