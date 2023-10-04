import { Group } from '@visx/group';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Pie from '@visx/shape/lib/shapes/Pie';
import { Text } from '@visx/text';
import React from 'react';
import useScreenSize from 'src/hooks/useScreenSize';
import { nFormatter } from 'src/utils';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AnimatedPie } from './animated-pie';
import { ChartBox } from './chart-box';
import { ChartDimensions } from './chart-utils';

export type PieProps = {
  width: number;
  height: number;
  margin?: { top: number; bottom: number; left: number; right: number };
  animate?: boolean;
};

export interface DonutDataPoint {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface DonutChartDataSet {
  units: string;
  dataPoints: DonutDataPoint[];
  name: string;
  showUnits: boolean;
  total: number;
}

interface DonutChartProps {
  title: string;
  subTitle: string;
  dataSet: DonutChartDataSet;
  children?: React.ReactNode;
  selectedDataPoint?: DonutDataPoint | null;
  onClick?: (dataPoint: DonutDataPoint) => void;
}

function Chart({
  width,
  height,
  dataSet,
  selectedDataPoint,
  onClick
}: {
  width: number;
  height: number;
  dataSet: DonutChartDataSet;
  selectedDataPoint?: DonutDataPoint | null;
  onClick?: (id: DonutDataPoint) => void;
}) {
  const getChartDimensions = ({ width = 0, height = 0 }: { width?: number; height?: number }): ChartDimensions => {
    const margin = {
      top: 10,
      right: 0,
      bottom: 50,
      left: 45
    };

    return {
      margin,
      boundedWidth: width - margin.left - margin.right,
      boundedHeight: height - margin.top - margin.bottom
    };
  };

  const { margin } = getChartDimensions({
    width,
    height
  });
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const donutThickness = 50;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;

  return (
    <div>
      <svg width={width} height={height} style={{ transition: 'all 0.7s ease-in-out' }}>
        <Group top={centerY + margin.top} left={centerX + margin.left}>
          <Pie
            data={
              selectedDataPoint
                ? dataSet.dataPoints.filter((item) => item.id === selectedDataPoint.id)
                : dataSet.dataPoints
            }
            pieValue={(point) => point.value}
            outerRadius={radius}
            innerRadius={radius - donutThickness}
            cornerRadius={3}
            padAngle={0.005}
          >
            {(pie) => (
              <AnimatedPie<DonutDataPoint>
                {...pie}
                animate={true}
                getKey={(arc) => arc.data.label}
                onClickDatum={({ data }) => {
                  onClick?.(data);
                }}
                getColor={(arc) => arc.data.color}
              />
            )}
          </Pie>
          {selectedDataPoint ? (
            <Text width={width} fill="gray" textAnchor="middle" verticalAnchor="middle">
              {`${nFormatter(selectedDataPoint.value, 2)} ${dataSet.showUnits ? dataSet.units : ''}`}
            </Text>
          ) : (
            <Text width={width} fill="gray" textAnchor="middle" verticalAnchor="middle">
              {`${nFormatter(dataSet.total, 2)} ${dataSet.showUnits ? dataSet.units : ''}`}
            </Text>
          )}
        </Group>
      </svg>
    </div>
  );
}

export function DonutChart({ title, subTitle, children, dataSet, selectedDataPoint, onClick }: DonutChartProps) {
  const { isDesktop } = useScreenSize();

  return (
    <ChartBox className="h-full">
      <div className="md:flex justify-between mb-4">
        <div>
          <div className="font-medium mt-3 font-heading text-lg">{title}</div>
          <div className={twMerge(secondaryTextColor, 'font-medium text-sm')}>{subTitle}</div>
        </div>
        {children}
      </div>
      <ParentSize debounceTime={10}>
        {({ width }) => (
          <Chart
            dataSet={dataSet}
            width={width}
            height={isDesktop ? 300 : 270}
            selectedDataPoint={selectedDataPoint}
            onClick={onClick}
          />
        )}
      </ParentSize>
    </ChartBox>
  );
}
