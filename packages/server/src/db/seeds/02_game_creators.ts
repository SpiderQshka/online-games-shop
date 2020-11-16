import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("game_creators").insert([
    {
      id: 1,
      name: "Ubisoft Entertainment",
      logo: "https://www.linkpicture.com/q/1024px-Ubisoft_logo.svg.png",
      yearOfFoundation: 1986,
    },
    {
      id: 2,
      name: "Bethesda Softworks",
      logo:
        "https://www.linkpicture.com/q/1920px-Bethesda_Game_Studios_logo.svg.png",
      yearOfFoundation: 1986,
    },
    {
      id: 3,
      name: "CD Projekt RED",
      logo: "https://www.linkpicture.com/q/73840_p7IuIJ8UeT_cd.jpg",
      yearOfFoundation: 1994,
    },
    {
      id: 4,
      name: "Activision Publishing, Inc.",
      logo: "https://www.linkpicture.com/q/500px-Activision.svg.png",
      yearOfFoundation: 1979,
    },
    {
      id: 5,
      name: "Valve Corporation",
      logo:
        "https://www.linkpicture.com/q/281f9d10aca59c7f9a0daf817a7f5576.jpg",
      yearOfFoundation: 1996,
    },
    {
      id: 6,
      name: "Rockstar Games, Inc.",
      logo: "https://www.linkpicture.com/q/index_17.png",
      yearOfFoundation: 1998,
    },
    {
      id: 7,
      name: "Larian Studios",
      logo: "https://www.linkpicture.com/q/LarianStudiosLogo.png",
      yearOfFoundation: 1996,
    },
    {
      id: 8,
      name: "Wargaming.net",
      logo: "https://www.linkpicture.com/q/Wargaming.net_logo.png",
      yearOfFoundation: 1998,
    },
    {
      id: 9,
      name: "Paradox Interactive",
      logo:
        "https://www.linkpicture.com/q/184px-Paradox_Interactive_logo.svg.png",
      yearOfFoundation: 1998,
    },
    {
      id: 10,
      name: "Electronic Arts",
      logo: "https://www.linkpicture.com/q/200px-Electronic_Arts_Logo_2020.png",
      yearOfFoundation: 1982,
    },
    {
      id: 11,
      name: "11 bit studios S.A.",
      logo: "https://www.linkpicture.com/q/11ише.png",
      yearOfFoundation: 2009,
    },
  ]);
}
