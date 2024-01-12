"use client";
import React from "react";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartTitle,
  ChartSeriesLabels,
  ChartLegend,
  ChartTooltip,
} from "@progress/kendo-react-charts";
import { Colors } from "@/utils/colors";
import {
  donutChartData,
  barChartData,
  barCategoryData,
} from "@/constants/dummy-data";

const Charts = () => {
  return (
    <div className="d-flex row  mt-3 flex-md-row flex-column">
      <div className="col-lg-7 col-12">
        <Chart>
          <ChartTitle text="Conversions" />
          <ChartCategoryAxis>
            <ChartCategoryAxisItem categories={barCategoryData} />
          </ChartCategoryAxis>
          <ChartSeries>
            <ChartSeriesItem
              type="column"
              color={Colors.barChartColor}
              data={barChartData}
            />
          </ChartSeries>
          <ChartTooltip
            render={(item) => {
              return <div>{item?.point?.value}%</div>;
            }}
          />
        </Chart>
      </div>
      <div className="col-lg-5 col-12">
        <Chart>
          <ChartTitle text="Traffic Channels" />
          <ChartSeries>
            <ChartSeriesItem
              type="donut"
              data={donutChartData}
              categoryField="kind"
              field="share"
            >
              <ChartSeriesLabels
                color={Colors.white}
                background="none"
                // content={labelContent}
              />
            </ChartSeriesItem>
          </ChartSeries>
          <ChartLegend position="bottom" />
          <ChartTooltip
            render={(item) => {
              return <div>{item?.point?.value}%</div>;
            }}
          />
        </Chart>
      </div>
    </div>
  );
};

export default Charts;
