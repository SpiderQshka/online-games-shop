import Knex from "knex";
import faker from "faker";

export async function seed(knex: Knex): Promise<void> {
  await knex("games").insert([
    {
      id: 1,
      name: "Mount and blade Warband",
      logo: "https://www.linkpicture.com/q/mnb-warband.jpg",
      description:
        "But co-creation energize correlation social innovation; communities innovate external partners shared unit of analysis. Correlation capacity building inspire social entrepreneur radical mobilize. Greenwashing equal opportunity contextualize then think tank challenges and opportunities compassion parse social innovation. Vibrant, preliminary thinking living a fully ethical life think tank effective altruism. Communities social intrapreneurship low-hanging fruit, efficient inspiring shared value compelling. Inspiring humanitarian outcomes disrupt effective. Relief; corporate social responsibility; paradigm resist optimism. Vibrant thought leader shared value; deep dive entrepreneur improve the world catalyze LGBTQ+. Collective impact, mass incarceration vibrant do-gooder triple bottom line strengthening infrastructure black lives matter. Collaborative cities, innovation move the needle game-changer low-hanging fruit. Social capital, thought provoking mass incarceration shared value mass incarceration. Grit commitment resist catalyze issue outcomes; ecosystem support. Leverage granular, empower social entrepreneurship accessibility, leverage justice venture philanthropy to. Parse, save the world social impact, move the needle ideate inclusion shared vocabulary. Empower communities.",
      ageRating: +faker.random.number({ min: 0, max: 18 }),
      price: 20,
      numberOfPhysicalCopies: +faker.random.number({ min: 0 }),
      gameCreatorId: 1,
      createdAt: faker.date.past(),
      physicalCopyPrice: 25,
    },
    {
      id: 2,
      name: "Mount and blade Bannerlord",
      logo: "https://www.linkpicture.com/q/5ae658ecb8c06024_1200xH.jpg",
      description:
        "But co-creation energize correlation social innovation; communities innovate external partners shared unit of analysis. Correlation capacity building inspire social entrepreneur radical mobilize. Greenwashing equal opportunity contextualize then think tank challenges and opportunities compassion parse social innovation. Vibrant, preliminary thinking living a fully ethical life think tank effective altruism. Communities social intrapreneurship low-hanging fruit, efficient inspiring shared value compelling. Inspiring humanitarian outcomes disrupt effective. Relief; corporate social responsibility; paradigm resist optimism. Vibrant thought leader shared value; deep dive entrepreneur improve the world catalyze LGBTQ+. Collective impact, mass incarceration vibrant do-gooder triple bottom line strengthening infrastructure black lives matter. Collaborative cities, innovation move the needle game-changer low-hanging fruit. Social capital, thought provoking mass incarceration shared value mass incarceration. Grit commitment resist catalyze issue outcomes; ecosystem support. Leverage granular, empower social entrepreneurship accessibility, leverage justice venture philanthropy to. Parse, save the world social impact, move the needle ideate inclusion shared vocabulary. Empower communities.",
      ageRating: +faker.random.number({ min: 0, max: 18 }),
      price: 15,
      numberOfPhysicalCopies: +faker.random.number({ min: 0 }),
      gameCreatorId: 1,
      createdAt: faker.date.past(),
      physicalCopyPrice: 20,
    },
    {
      id: 3,
      name: "Battle Brothers",
      logo:
        "https://www.linkpicture.com/q/battle-brothers-poluchit-krupnejshie-dlc-blazing-deserts.jpg",
      description:
        "But co-creation energize correlation social innovation; communities innovate external partners shared unit of analysis. Correlation capacity building inspire social entrepreneur radical mobilize. Greenwashing equal opportunity contextualize then think tank challenges and opportunities compassion parse social innovation. Vibrant, preliminary thinking living a fully ethical life think tank effective altruism. Communities social intrapreneurship low-hanging fruit, efficient inspiring shared value compelling. Inspiring humanitarian outcomes disrupt effective. Relief; corporate social responsibility; paradigm resist optimism. Vibrant thought leader shared value; deep dive entrepreneur improve the world catalyze LGBTQ+. Collective impact, mass incarceration vibrant do-gooder triple bottom line strengthening infrastructure black lives matter. Collaborative cities, innovation move the needle game-changer low-hanging fruit. Social capital, thought provoking mass incarceration shared value mass incarceration. Grit commitment resist catalyze issue outcomes; ecosystem support. Leverage granular, empower social entrepreneurship accessibility, leverage justice venture philanthropy to. Parse, save the world social impact, move the needle ideate inclusion shared vocabulary. Empower communities.",
      ageRating: +faker.random.number({ min: 0, max: 18 }),
      price: 10,
      numberOfPhysicalCopies: +faker.random.number({ min: 0 }),
      gameCreatorId: 2,
      createdAt: faker.date.past(),
      physicalCopyPrice: 20,
    },
    {
      id: 4,
      name: "Total War Rome ||",
      logo: "https://www.linkpicture.com/q/Total_War_Rome_2.jpg",
      description:
        "But co-creation energize correlation social innovation; communities innovate external partners shared unit of analysis. Correlation capacity building inspire social entrepreneur radical mobilize. Greenwashing equal opportunity contextualize then think tank challenges and opportunities compassion parse social innovation. Vibrant, preliminary thinking living a fully ethical life think tank effective altruism. Communities social intrapreneurship low-hanging fruit, efficient inspiring shared value compelling. Inspiring humanitarian outcomes disrupt effective. Relief; corporate social responsibility; paradigm resist optimism. Vibrant thought leader shared value; deep dive entrepreneur improve the world catalyze LGBTQ+. Collective impact, mass incarceration vibrant do-gooder triple bottom line strengthening infrastructure black lives matter. Collaborative cities, innovation move the needle game-changer low-hanging fruit. Social capital, thought provoking mass incarceration shared value mass incarceration. Grit commitment resist catalyze issue outcomes; ecosystem support. Leverage granular, empower social entrepreneurship accessibility, leverage justice venture philanthropy to. Parse, save the world social impact, move the needle ideate inclusion shared vocabulary. Empower communities.",
      ageRating: +faker.random.number({ min: 0, max: 18 }),
      price: 25,
      numberOfPhysicalCopies: +faker.random.number({ min: 0 }),
      gameCreatorId: 2,
      createdAt: faker.date.past(),
      physicalCopyPrice: 30,
    },
  ]);
}
