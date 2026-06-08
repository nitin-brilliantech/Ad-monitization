import React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AreaCharts = ({
  data = [],
  xKey = "day",
  yKey = "count",
  yDomain = [0, 100],
  yTicks=[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  strokeColor = "#4f46e5",
  fillColor = "#4f46e5",
  strokeDasharray = "0",
  title,
  showHorizontalGrid = true,
  showVerticalGrid = false,
  showTooltip = true,
  height = 400,
  className = "",
  gradientId = "colorFill", // Unique ID for gradient,
  type='linear'
}) => {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className={className} style={{ width: "100%", height }}>
      {title && (
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      )}

      {hasData ? (
        <ResponsiveContainer>
          <RechartsAreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            {/* Gradient definition */}
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={fillColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Axes */}
            <XAxis dataKey={xKey} tick={xKey} />
            <YAxis domain={yDomain} ticks={yTicks}
              tickCount={yTicks ? undefined : 10} />

            {/* Grid & Tooltip */}
            <CartesianGrid
              horizontal={showHorizontalGrid}
              vertical={showVerticalGrid}
              strokeDasharray="3 3"
            />
            {showTooltip && <Tooltip />}

            {/* Area Line */}
            <Area
              type={type}
              dataKey={yKey}
              stroke={strokeColor}
              strokeDasharray={strokeDasharray}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-gray-500 text-center py-10">
          No data available
        </div>
      )}
    </div>
  );
};

export default AreaCharts;
