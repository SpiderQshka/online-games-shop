import React from "react";
import styles from "./styles.module.scss";

interface CounterProps {
  value: number;
  handleValueChange: (value: number) => void;
  maxValue: number;
  minValue: number;
}

export const Counter: React.FunctionComponent<CounterProps> = ({
  value,
  handleValueChange,
  maxValue,
  minValue,
}) => {
  return (
    <div className={styles.counterContainer}>
      <button
        className={`${styles.btn}`}
        onClick={() =>
          handleValueChange(value - 1 > minValue ? value - 1 : minValue)
        }
      >
        -
      </button>
      <input
        className={styles.input}
        type="number"
        value={value}
        min={minValue}
        max={maxValue}
      />
      <button
        className={`${styles.btn}`}
        onClick={() =>
          handleValueChange(value + 1 < maxValue ? value + 1 : maxValue)
        }
      >
        +
      </button>
    </div>
  );
};
