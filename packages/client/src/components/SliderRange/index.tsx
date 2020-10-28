import { Range } from "rc-slider";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import "./rc-slider.scss";

interface SliderRangeProps {
  bounds: { lowerBound: number; upperBound: number };
  min: number;
  max: number;
  handleChange: (config: { lowerBound: number; upperBound: number }) => void;
}

export const SliderRange: React.FunctionComponent<SliderRangeProps> = ({
  bounds,
  min,
  max,
  handleChange,
}) => {
  const onLowerBoundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setBounds({ ...bounds, lowerBound: +e.target.value });
    handleChange({ ...bounds, lowerBound: +e.target.value });
  };

  const onUpperBoundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setBounds({ ...bounds, upperBound: +e.target.value });
    handleChange({ ...bounds, upperBound: +e.target.value });
  };

  const onSliderChange = (value: number[]) => {
    handleChange({ lowerBound: value[0], upperBound: value[1] });
  };

  return (
    <div className={styles.sliderRangeContainer}>
      <Range
        allowCross={false}
        value={[bounds.lowerBound, bounds.upperBound]}
        min={min}
        max={max}
        className={styles.range}
        onChange={onSliderChange}
        step={0.05}
      />
      <div className={styles.inputsContainer}>
        <div className={styles.inputContainer}>
          <input
            type="number"
            value={bounds.lowerBound}
            className={`${styles.input} ${styles.lower}`}
            onChange={onLowerBoundChange}
            max={bounds.upperBound}
          />
        </div>
        <div className={styles.inputContainer}>
          <input
            type="number"
            value={bounds.upperBound}
            className={`${styles.input} ${styles.upper}`}
            onChange={onUpperBoundChange}
            min={bounds.lowerBound}
          />
        </div>
      </div>
    </div>
  );
};
