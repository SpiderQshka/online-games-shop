import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./styles.module.scss";

interface SelectProps {
  selectedValue: string;
  valuesList: { label: string; value: string }[];
  handleChange: (value: string) => void;
}

export const Select: React.FunctionComponent<SelectProps> = ({
  selectedValue,
  valuesList,
  handleChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className={styles.selectContainer}>
      <div
        className={`${styles.selectedValue} ${isOpen && styles.active}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {valuesList.filter(({ value }) => selectedValue === value)[0].label}
        <FaArrowLeft className={`${styles.icon} ${isOpen && styles.active}`} />
      </div>
      {isOpen && (
        <ul className={styles.selectOptions}>
          {valuesList.map(({ label, value }, i) => {
            return (
              <li
                className={`${styles.selectOption} ${
                  value === selectedValue && styles.active
                }`}
                key={i}
                onClick={() => {
                  handleChange(value);
                  setIsOpen(false);
                }}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
