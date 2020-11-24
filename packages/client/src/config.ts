import { ifAppRunsLocally } from "utils/helpers";

export const config = {
  apiUrl: ifAppRunsLocally
    ? process.env.REACT_APP_API_URL
    : process.env.REACT_APP_HEROKU_API_URL,
  colors: {
    accent: "#f0810f",
    primaryLight: "#f4f4f4",
    primary: "#3a3a3a",
    primaryDark: "#3a3a3a",
    secondary: "#191919",
    secondaryDark: "#121212",
    secondaryLight: "#2a2a2a",
    error: "#e32b2b",
    success: "#5a9516",
  },
  contacts: {
    tel: "+123456789",
    mail: "super.duper@gmail.com",
    address: "Pushkina Street, Kolotushkina House",
  },
  popupTimeout: 5000,
};
