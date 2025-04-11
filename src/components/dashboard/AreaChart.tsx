
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AreaChartProps {
  title: string;
  data: any[];
  dataKey: string;
  domain?: [number, number];
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  xAxisKey?: string;
  height?: number;
  areaColor?: string;
}

const AreaChart: React.FC<AreaChartProps> = ({
  title,
  data,
  dataKey,
  domain,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  showTooltip = true,
  xAxisKey = "name",
  height = 300,
  areaColor = "hsl(var(--primary))",
}) => {
  // Convert hsl variable to an actual color for gradient
  const getColor = (color: string) => {
    // This is a simple implementation, in production you'd use a more robust method
    if (color.startsWith("hsl(var(--")) {
      return "rgba(66, 133, 244, 0.7)"; // Fallback if CSS variable
    }
    return color;
  };

  const renderColorfulAreaChart = (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={getColor(areaColor)} stopOpacity={0.8} />
            <stop offset="95%" stopColor={getColor(areaColor)} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showXAxis && (
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
        )}
        {showYAxis && (
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            domain={domain}
            width={30}
          />
        )}
        {showGrid && <CartesianGrid vertical={false} strokeDasharray="3 3" />}
        {showTooltip && <Tooltip />}
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={getColor(areaColor)}
          fillOpacity={1}
          fill="url(#colorGradient)"
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{renderColorfulAreaChart}</CardContent>
    </Card>
  );
};

export default AreaChart;
