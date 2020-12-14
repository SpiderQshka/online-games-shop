import { Header } from "components/Header";
import React from "react";
import { setPageTitle } from "utils/helpers";
import styles from "./styles.module.scss";

export const FAQ = () => {
  setPageTitle("FAQ");
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.header}>Frequently Asked Question</h2>
          <ul className={styles.list}>
            <li className={styles.item}>
              <h3 className={styles.itemHeader}>
                What is the Online Games Store?
              </h3>
              <p className={styles.itemContent}>
                The Online Games Store is a curated digital storefront for PC
                and Mac, designed with both players and creators in mind. It’s
                focused on providing great games for gamers, and a fair deal for
                game developers. When you buy a game on the Online Games Store,
                88% of the price goes directly to developers, versus only 70% on
                many other stores. This helps developers invest into building
                bigger and better games.
              </p>
            </li>
            <li className={styles.item}>
              <h3 className={styles.itemHeader}>
                What are the future plans for the Online Games Store?
              </h3>
              <p className={styles.itemContent}>
                You can find upcoming features, developer updates, and major
                known issues on our Online Games Store Roadmap on Trello. We’ll
                also share significant updates with you on our news feed and
                social media pages such as Facebook, Twitter, Instagram, and
                YouTube.
              </p>
            </li>
            <li className={styles.item}>
              <h3 className={styles.itemHeader}>
                Why does the Online Games Store make exclusivity deals?
              </h3>
              <p className={styles.itemContent}>
                Exclusives are a part of the growth of many successful platforms
                for games and for other forms of digital entertainment, such as
                streaming video and music. OGS works in partnership with
                developers and publishers to offer games exclusively on the
                store. In exchange for exclusivity, OGS provides them with
                financial support for development and marketing, which enables
                them to build more polished games with significantly less
                uncertainty for the creators. In addition, creators will earn
                88% of all the revenue from their game, while most stores only
                offer 70%.
              </p>
            </li>
            <li className={styles.item}>
              <h3 className={styles.itemHeader}>
                What is the Support-A-Creator program?
              </h3>
              <p className={styles.itemContent}>
                The Support-A-Creator program enables content Creators to earn
                money from games in the Online Games Store by using Creator
                Links and Creator Tags.
              </p>
            </li>
            <li className={styles.item}>
              <h3 className={styles.itemHeader}>
                What’s this about free games?
              </h3>
              <p className={styles.itemContent}>
                OGS will be offering a new free game available each week
                throughout 2020. When you claim a free game, it’s yours to keep
                - even after the game is no longer available to new customers
                for free.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default FAQ;
