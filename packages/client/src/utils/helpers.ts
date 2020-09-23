export const setUserSessionData = (gamesIds: number[]) =>
  localStorage.setItem("gamesIds", JSON.stringify(gamesIds));

export const getUserSessionData = (): number[] =>
  JSON.parse(localStorage.getItem("gamesIds") as string);
