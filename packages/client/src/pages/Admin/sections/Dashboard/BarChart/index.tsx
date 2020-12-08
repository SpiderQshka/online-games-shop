import { config } from "config";
import { useWindowDimensions } from "hooks/windowDimensions";
import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./styles.module.scss";

interface BarChartProps {
  data: { name: string; price: number }[];
}

export const BarChart: React.FunctionComponent<BarChartProps> = ({ data }) => {
  const { width } = useWindowDimensions();

  const chartHeight = width / 2 > 500 ? 500 : width / 2;
  return (
    <ResponsiveContainer width={"100%"} height={chartHeight}>
      <RechartsBarChart
        data={data}
        margin={{ top: 15, right: 20 }}
        className={styles.barChart}
      >
        <XAxis dataKey="name" stroke={config.colors.secondaryLight} />
        <YAxis stroke={config.colors.primaryLight} />
        <Tooltip />
        <Bar dataKey="price" fill={config.colors.primaryDark} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
