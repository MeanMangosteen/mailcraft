import React, { useState } from "react";
import { PieChart, Pie, Sector } from "recharts";
import Smooth from "react-smooth";
const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Smooth
        duration={500}
        from={{ radius: outerRadius }}
        to={{ radius: outerRadius + 10 }}
      >
        {({ radius }) => (
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={radius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
          />
        )}
      </Smooth>
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={innerRadius - 8}
        outerRadius={innerRadius - 6}
        fill={fill}
      />
    </g>
  );
};

export const TwoLevelPieChart = () => {
  const [activeIndex, setActiveIndex] = useState<any>(0);

  const onPieEnter = (data, index) => {
    setActiveIndex(index);
  };
  return (
    <PieChart width={800} height={400} onMouseEnter={onPieEnter}>
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={data}
        dataKey="value"
        cx={300}
        cy={200}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        isAnimationActive={false}
      />
    </PieChart>
  );
};
