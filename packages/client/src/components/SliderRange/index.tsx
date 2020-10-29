import { Range } from "rc-slider";
import React from "react";
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
    handleChange({ ...bounds, lowerBound: +e.target.value });
  };

  const onUpperBoundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange({ ...bounds, upperBound: +e.target.value });
  };

  const onSliderChange = (value: number[]) => {
    handleChange({ lowerBound: value[0], upperBound: value[1] });
  };

  const step = 0.01;

  return (
    <div className={styles.sliderRangeContainer}>
      <Range
        allowCross={false}
        value={[bounds.lowerBound, bounds.upperBound]}
        min={min}
        max={max}
        className={styles.range}
        onChange={onSliderChange}
        step={step}
      />
      <div className={styles.inputsContainer}>
        <label className={styles.inputLabel}>
          From
          <input
            type="number"
            value={bounds.lowerBound}
            className={`${styles.input} ${styles.lower}`}
            onChange={onLowerBoundChange}
            max={bounds.upperBound}
            step={step}
          />
        </label>

        <label className={styles.inputLabel}>
          To
          <input
            type="number"
            value={bounds.upperBound}
            className={`${styles.input} ${styles.upper}`}
            onChange={onUpperBoundChange}
            min={bounds.lowerBound}
            step={step}
          />
        </label>
      </div>
    </div>
  );
};
