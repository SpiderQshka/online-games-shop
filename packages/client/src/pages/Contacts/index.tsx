import { Header } from "components/Header";
import React from "react";
import { FaHome, FaMailBulk, FaPhone } from "react-icons/fa";
import { Map, Placemark } from "react-yandex-maps";
import styles from "./styles.module.scss";

export const Contacts = () => {
  return (
    <>
      <Header />
      <div className={styles.contactsContainer}>
        <div className={styles.mapContainer}>
          <Map
            className={styles.map}
            defaultState={{ center: [53.888351, 27.544296], zoom: 15 }}
          >
            <Placemark geometry={[53.888351, 27.544296]} />
          </Map>
        </div>
        <div className={styles.contacts}>
          <h2 className={styles.header}>OGS Company</h2>
          <ul className={styles.contactsList}>
            <li className={styles.contactItem}>
              <div className={styles.iconContainer}>
                <FaPhone size={"100%"} />
              </div>
              <div className={styles.contentContainer}>
                <p className={styles.contactDescription}>Give us a call</p>
                <a className={styles.contactData} href={"tel:+123456789"}>
                  +123 456 789
                </a>
              </div>
            </li>
            <li className={styles.contactItem}>
              <div className={styles.iconContainer}>
                <FaMailBulk size={"100%"} />
              </div>
              <div className={styles.contentContainer}>
                <p className={styles.contactDescription}>Send us an email</p>
                <a
                  className={styles.contactData}
                  href={"mailto:super.duper@gmail.com"}
                >
                  super.duper@gmail.com
                </a>
              </div>
            </li>
            <li className={styles.contactItem}>
              <div className={styles.iconContainer}>
                <FaHome size={"100%"} />
              </div>
              <div className={styles.contentContainer}>
                <p className={styles.contactDescription}>Come see us</p>
                <a
                  className={styles.contactData}
                  href={
                    "https://yandex.by/maps/157/minsk/house/Zk4YcwNkS0wBQFtpfXR5eX9mZQ==/?ll=27.544471%2C53.887782&z=18"
                  }
                >
                  Pushkina Street, Kolotushkina House
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Contacts;
