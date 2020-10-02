import { createContext, useContext } from "react";

export interface IAuth {
  token: string | null;
  setToken: (token: string) => void;
  doesTokenExist: () => boolean;
  removeToken: () => void;
}

export const AuthContext = createContext<IAuth>({
  token: localStorage.getItem("token"),
  setToken: (token) => localStorage.setItem("token", token),
  doesTokenExist: () => !!localStorage.getItem("token"),
  removeToken: () => localStorage.removeItem("token"),
});

export function useAuth() {
  return useContext(AuthContext);
}
