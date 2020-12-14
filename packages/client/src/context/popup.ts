import { createContext, useContext } from "react";

export type PopupType = "error" | "success" | "neutral";

export interface IPopup {
  isOpen: boolean;
  type: PopupType;
  msg: string;
  status: number;
  showPopup: (config: { type: PopupType; msg: string; code?: number }) => void;
  hidePopup: () => void;
}

export const PopupContext = createContext<IPopup>({} as IPopup);

export function usePopup() {
  return useContext(PopupContext);
}
