import { createContext, useContext } from "react";

export interface IAuth {
  token: string | null;
  setToken: (token: string) => void;
}

export const AuthContext = createContext<IAuth>({
  token: null,
  setToken: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
