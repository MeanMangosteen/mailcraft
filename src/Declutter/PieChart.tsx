import React from "react";
import { createClassFromSpec } from "react-vega";

// export default
// const PChart = ({ values }) => {
//   return <PieChart values={values} />;
// };
// export default PChart;
export default createClassFromSpec({
  spec: {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    description: "A basic pie chart example.",
    width: 800,
    height: 800,
    autosize: "none",

    signals: [
      {
        name: "startAngle",
        value: 0,
        // bind: { input: "range", min: 0, max: 6.29, step: 0.01 },
      },
      {
        name: "endAngle",
        value: 6.29,
        // bind: { input: "range", min: 0, max: 6.29, step: 0.01 },
      },
      {
        name: "padAngle",
        value: 0,
        // bind: { input: "range", min: 0, max: 0.1 },
      },
      {
        name: "innerRadius",
        value: "45",
        // bind: { input: "range", min: 0, max: 90, step: 1 },
      },
      {
        name: "cornerRadius",
        value: 0,
        // bind: { input: "range", min: 0, max: 10, step: 0.5 },
      },
      {
        name: "sort",
        value: false,
        // bind: { input: "checkbox" },
      },
      {
        name: "tooltip",
        value: {},
        on: [
          { events: "arc:mouseover", update: "datum" },
          { events: "arc:mouseout", update: "{}" },
        ],
      },
    ],

    data: [
      {
        name: "table",
        async: true,
        //  [
        //   { id: 1, field: 4 },
        //   { id: 2, field: 6 },
        //   { id: 3, field: 10 },
        //   { id: 4, field: 3 },
        //   { id: 5, field: 7 },
        //   { id: 6, field: 8 },
        // ],
        transform: [
          {
            type: "pie",
            field: "field",
            startAngle: { signal: "startAngle" },
            endAngle: { signal: "endAngle" },
            sort: { signal: "sort" },
          },
        ],
      },
    ],

    scales: [
      {
        name: "color",
        type: "ordinal",
        domain: { data: "table", field: "id" },
        range: { scheme: "category20" },
      },
    ],

    marks: [
      {
        type: "arc",
        from: { data: "table" },
        encode: {
          enter: {
            fill: { scale: "color", field: "id" },
            x: { signal: "width / 2" },
            y: { signal: "height / 2" },
          },
          update: {
            startAngle: { field: "startAngle" },
            endAngle: { field: "endAngle" },
            padAngle: { signal: "padAngle" },
            innerRadius: { value: 50 },
            outerRadius: { signal: "width / 2" },
            cornerRadius: { signal: "cornerRadius" },
          },
        },
      },
      {
        type: "text",
        from: { data: "table" },
        encode: {
          enter: {
            x: { signal: "if(width >= height, height, width) / 2" },
            y: { signal: "if(width >= height, height, width) / 2" },
            radius: { signal: "if(width >= height, height, width) / 2 * 0.65" },
            theta: { signal: "(datum.startAngle + datum.endAngle)/2" },
            fill: { value: "#000" },
            align: { value: "center" },
            baseline: { value: "middle" },
            text: { field: "id" },
          },
          update: {
            fillOpacity: { signal: "if(tooltip.field, 0, 1)" },
          },
        },
      },
      {
        type: "text",
        encode: {
          enter: {
            x: { signal: "if(width >= height, height, width) / 2" },
            y: { signal: "if(width >= height, height, width) / 2" },
            radius: { signal: "if(width >= height, height, width) / 2 * 0.65" },

            fill: { value: "#000" },
            align: { value: "center" },
            baseline: { value: "middle" },
          },
          update: {
            theta: { signal: "(tooltip.startAngle + tooltip.endAngle)/2" },
            fillOpacity: { signal: "if(tooltip.field, 1, 0)" },
            text: { signal: "tooltip.field" },
          },
        },
      },
    ],
  },
});
