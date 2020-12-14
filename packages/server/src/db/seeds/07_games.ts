import Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
  await knex("games").insert([
    {
      id: 1,
      name: "Assassin's Creed Valhalla",
      logo: "https://www.linkpicture.com/q/AC_Valhalla_standard_edition.jpg",
      description:
        "Вам предстоит пройти путь к славе, сыграв за легендарного викинга. Нападайте на врагов, развивайте селение и усиливайте влияние.",
      ageRating: 18,
      price: 20,
      numberOfPhysicalCopies: 100,
      gameCreatorId: 1,
      createdAt: faker.date.past(),
      physicalCopyPrice: 25,
    },
    {
      id: 2,
      name: "The Elder Scrolls 5 - Skyrim",
      logo:
        "https://www.linkpicture.com/q/1200px-The_Elder_Scrolls_V_-_Skyrim.jpg",
      description:
        "Winner of more than 200 Game of the Year Awards, Skyrim Special Edition brings the epic fantasy to life in stunning detail. The Special Edition includes the critically acclaimed game and add-ons with all-new features like remastered art and effects, volumetric god rays, dynamic depth of field, screen-space reflections, and more. Skyrim Special Edition also brings the full power of mods to the PC and consoles. New quests, environments, characters, dialogue, armor, weapons and more – with Mods, there are no limits to what you can experience. ",
      ageRating: 18,
      price: 15,
      numberOfPhysicalCopies: 120,
      gameCreatorId: 2,
      createdAt: faker.date.past(),
      physicalCopyPrice: 20,
    },
    {
      id: 3,
      name: "Cyberpunk 2077",
      logo:
        "https://www.linkpicture.com/q/Обложка_компьютерной_игры_Cyberpunk_2077.jpg",
      description:
        "Cyberpunk 2077 — приключенческая ролевая игра, действие которой происходит в мегаполисе Найт-Сити, где власть, роскошь и модификации тела ценятся выше всего. Вы играете за V, наёмника в поисках устройства, позволяющего обрести бессмертие. Вы сможете менять киберимпланты, навыки и стиль игры своего персонажа, исследуя открытый мир, где ваши поступки влияют на ход сюжета и всё, что вас окружает.",
      ageRating: 18,
      price: 10,
      numberOfPhysicalCopies: 0,
      gameCreatorId: 3,
      createdAt: faker.date.past(),
      physicalCopyPrice: 20,
    },
    {
      id: 4,
      name: "Call Of Duty Black Ops 4",
      logo: "https://www.linkpicture.com/q/G2kL4.png",
      description:
        "В издание Call of Duty®: Black Ops IIII Zombies Chronicles входят полная версия основной игры и дополнение Zombies Chronicles. Игра Call of Duty: Black Ops III, содержащая уникальную кампанию, cетевую игру и режим 'Зомби', является одним из самых глубоких и впечатляющих продуктов серии Call of Duty. В дополнение Zombies Chronicles входят 8 классических карт для режима 'Зомби' из игр Call of Duty®: World at War, Call of Duty®: Black Ops и Call of Duty®: Black Ops II. Все карты адаптированы для использования в Call of Duty®: Black Ops III в высоком разрешении. ",
      ageRating: 18,
      price: 25,
      numberOfPhysicalCopies: 400,
      gameCreatorId: 4,
      createdAt: faker.date.past(),
      physicalCopyPrice: 30,
    },
    {
      id: 5,
      name: "Half Life 2",
      logo: "https://www.linkpicture.com/q/46456456456.png",
      description:
        "1998 год. HALF-LIFE шокирует игровую индустрию сочетанием напряженного действия и непрерывного, затягивающего сюжета. Дебютная игра Valve завоевала свыше 50 наград «Игра года» на пути к получению титула «Лучшая игра для РС всех времен» от PC Gamer; она раскрутила франшизу, которая продала свыше восьми миллионов коробочных версий по всему миру. СЕЙЧАС. Сохранив атмосферу тревоги, вызова и внутреннего напряжения и добавив новый реализм и интерактивность, Half-Life 2 открывает дверь в мир, в котором присутствие игрока влияет на все, что его окружает — от физической среды до поведения и даже эмоций как друзей, так и врагов. Игрок вновь поднимает монтировку ученого-исследователя Гордона Фримена, который обнаруживает себя на наводненной чужаками Земле, ресурсы которой стремительно опустошаются, а население вырождается. Фримену навязана неизбежная роль спасителя человечества от того зла, которое он выпустил на свободу в Черной Мезе. И очень многие дорогие ему люди надеются на него.",
      ageRating: 16,
      price: 25,
      numberOfPhysicalCopies: 1,
      gameCreatorId: 5,
      createdAt: faker.date.past(),
      physicalCopyPrice: 30,
    },
    {
      id: 6,
      name: "Grand Thieft Auto 5",
      logo: "https://www.linkpicture.com/q/GTAV_Official_Cover_Art.jpg",
      description:
        "Grand Theft Auto V для PC позволяет игрокам исследовать знаменитый мир Лос-Сантоса и округа Блэйн в разрешении до 4k и выше с частотой 60 кадров в секунду. ",
      ageRating: 18,
      price: 25,
      numberOfPhysicalCopies: 6,
      gameCreatorId: 6,
      createdAt: faker.date.past(),
      physicalCopyPrice: 30,
    },
    {
      id: 7,
      name: "Baldue's Gate 3",
      logo: "https://www.linkpicture.com/q/unnamed_17.jpg",
      description:
        "Соберите отряд и вернитесь в Забытые Королевства. Вас ждет история о дружбе и предательстве, выживании и самопожертвовании, о сладком зове абсолютной власти. ",
      ageRating: 18,
      price: 25,
      numberOfPhysicalCopies: 60,
      gameCreatorId: 7,
      createdAt: faker.date.past(),
      physicalCopyPrice: 30,
    },
    {
      id: 8,
      name: "World Of Tanks",
      logo: "https://www.linkpicture.com/q/kak_igrat_v_world_of_tanks.png",
      description:
        "World of Tanks — культовая ММО-игра о бронетехнике, покорившая миллионы игроков по всему миру. Разнообразие игровых карт, исторически достоверные машины, реалистичный геймплей — присоединяйтесь к армии танкистов и окунитесь в атмосферу легендарных сражений.",
      ageRating: 12,
      price: 25,
      numberOfPhysicalCopies: 12,
      gameCreatorId: 8,
      createdAt: faker.date.past(),
      physicalCopyPrice: 30,
    },
    {
      id: 9,
      name: "Hearts Of Iron 4",
      logo: "https://www.linkpicture.com/q/03947976.jpg",
      description:
        "Victory is at your fingertips! Your ability to lead your nation is your supreme weapon, the strategy game Hearts of Iron IV lets you take command of any nation in World War II; the most engaging conflict in world history. ",
      ageRating: 16,
      price: 25,
      numberOfPhysicalCopies: 111,
      gameCreatorId: 9,
      createdAt: faker.date.past(),
      physicalCopyPrice: 30,
    },
    {
      id: 10,
      name: "Need For Speed 2015",
      logo: "https://www.linkpicture.com/q/Need_for_Speed_Coverart.jpg",
      description:
        "Готовы подчинить себе улицы? Садитесь за руль прославленных машин и мчитесь по Вентуре-Бэй - большому городу, открытому вам. Участвуйте в череде переплетающихся историй, улучшая свою репутацию - а заодно и собирая машину мечты, и станьте безусловным лидером гонок. Играйте снова и снова, ведь на этот раз можно выиграть 5 уникальными способами.",
      ageRating: 12,
      price: 25,
      numberOfPhysicalCopies: 323,
      gameCreatorId: 10,
      createdAt: faker.date.past(),
      physicalCopyPrice: 30,
    },

    {
      id: 11,
      name: "This War of Mine",
      logo: "https://www.linkpicture.com/q/81XoHV9PxdL._SL1500.jpg",
      description:
        "В «This War of Mine» вы играете не за солдата элитных войск, а за группу мирных жителей, пытающихся выжить в осажденном городе, испытывая нехватку еды, лекарств и постоянную опасность со стороны снайперов и мародеров. ",
      ageRating: 16,
      price: 25,
      numberOfPhysicalCopies: 3,
      gameCreatorId: 11,
      createdAt: faker.date.past(),
      physicalCopyPrice: 30,
    },
  ]);
}
