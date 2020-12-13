import { Header } from "components/Header";
import { config } from "config";
import React from "react";
import { FaHome, FaMailBulk, FaPhone } from "react-icons/fa";
import { Map, Placemark } from "react-yandex-maps";
import { setPageTitle } from "utils/helpers";
import styles from "./styles.module.scss";

export const Contacts = () => {
  setPageTitle("Contacts");
  return (
    <>
      <Header />
      <div className={styles.contactsContainer}>
        <div className={styles.mapContainer}>
          <Map
            className={styles.map}
            defaultState={{ center: config.contacts.coordinates, zoom: 15 }}
          >
            <Placemark geometry={config.contacts.coordinates} />
          </Map>
        </div>
        <div className={styles.contacts}>
          <h2 className={styles.header}>OGS Company</h2>
          <ul className={styles.contactsList}>
            <li className={styles.contactItem}>
              <a
                href={`tel:${config.contacts.tel}`}
                className={styles.contactItemContent}
              >
                <div className={styles.iconContainer}>
                  <FaPhone size={"100%"} />
                </div>
                <div className={styles.contentContainer}>
                  <p className={styles.contactDescription}>Give us a call</p>
                  <span className={styles.contactData}>
                    {config.contacts.tel}
                  </span>
                </div>
              </a>
            </li>
            <li className={styles.contactItem}>
              <a
                href={`mailto:${config.contacts.mail}`}
                className={styles.contactItemContent}
              >
                <div className={styles.iconContainer}>
                  <FaMailBulk size={"100%"} />
                </div>
                <div className={styles.contentContainer}>
                  <p className={styles.contactDescription}>Send us an email</p>
                  <span className={styles.contactData}>
                    {config.contacts.mail}
                  </span>
                </div>
              </a>
            </li>
            <li className={styles.contactItem}>
              <a
                href={config.contacts.mapLink}
                className={styles.contactItemContent}
                target="_blank"
              >
                <div className={styles.iconContainer}>
                  <FaHome size={"100%"} />
                </div>
                <div className={styles.contentContainer}>
                  <p className={styles.contactDescription}>Come see us</p>
                  <span className={styles.contactData}>
                    {config.contacts.address}
                  </span>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Contacts;
