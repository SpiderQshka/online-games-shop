import { ifAppRunsLocally } from "utils/helpers";

export const config = {
  apiUrl: ifAppRunsLocally
    ? "http://localhost:3333/api/v1"
    : "https://online-games-shop-server.herokuapp.com/api/v1",
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
    mapLink:
      "https://yandex.by/maps/157/minsk/house/Zk4YcwNkS0wBQFtpfXR5eX9mZQ==/?ll=27.544471%2C53.887782&z=18",
    coordinates: [53.888351, 27.544296],
  },
  popupTimeout: 2000,
};
