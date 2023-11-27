import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useTheme } from 'next-themes';
import { useLayoutEffect } from 'react';
import { ReservoirOrderDepth } from 'src/utils/types';
import tailwindConfig from '../../settings/tailwind/elements/foundations';
import { twMerge } from 'tailwind-merge';

type Props = {
  data: { buy: ReservoirOrderDepth; sell: ReservoirOrderDepth };
};

const OrderDepthChart = ({ data }: Props) => {
  const showOutliers = true;

  return (
    <div className="h-full">
      <div className="xl:flex justify-between py-5 items-center">
        <div className="flex items-end gap-1">
          <div className={twMerge('font-bold text-22 leading-9 text-neutral-700 dark:text-white')}>Order Depth</div>
        </div>
      </div>

      <div className="rounded-lg h-154.5 bg-zinc-300 dark:bg-neutral-800 py-5 px-2.5">
        <OrderDepthChartSub data={data} hideOutliers={!showOutliers} key={String(showOutliers)} />
      </div>
    </div>
  );
};

type Props2 = {
  data: { buy: ReservoirOrderDepth; sell: ReservoirOrderDepth };
  hideOutliers: boolean;
};

const OrderDepthChartSub = ({ data, hideOutliers }: Props2) => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const themeToUse = tailwindConfig.colors[darkMode ? 'dark' : 'light'];

  const filteredOutliers = (data: ReservoirOrderDepth) => {
    const depthPrices = data.depth.map((v) => v.price).sort((a, b) => a - b);
    const lowerHalfMedian = depthPrices[Math.floor(depthPrices.length / 4)];
    const upperHalfMedian = depthPrices[Math.floor((depthPrices.length * 3) / 4)];
    const iqr = upperHalfMedian - lowerHalfMedian;
    const lowerThreshold = lowerHalfMedian - 1.5 * iqr;
    const upperThreshold = upperHalfMedian + 1.5 * iqr;
    const filteredPrices = data.depth.filter((v) => v.price >= lowerThreshold && v.price <= upperThreshold);
    return filteredPrices;
  };

  let dataToRender = data;
  if (hideOutliers) {
    const filteredBids = filteredOutliers(data.buy);
    const filteredAsks = filteredOutliers(data.sell);
    dataToRender = { buy: { depth: filteredBids }, sell: { depth: filteredAsks } };
  }

  useLayoutEffect(() => {
    const root = am5.Root.new('chartdiv');
    root._logo?.dispose();

    const chartLinesColor = darkMode ? tailwindConfig.colors['yellow'][700] : tailwindConfig.colors['amber'][500];

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    const myTheme = am5.Theme.new(root);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commonConfig: any = {
      fill: am5.color(themeToUse.disabled),
      fontSize: '12px',
      fontFamily: 'Barlow',
      fontWeight: '400'
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tooltipConfig: any = {
      fill: am5.color(tailwindConfig.colors['neutral'][700]),
      fontSize: '12px',
      fontFamily: 'Barlow',
      fontWeight: '500'
    };

    myTheme.rule('Label').setAll(commonConfig);

    root.setThemes([am5themes_Animated.new(root), myTheme]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: true,
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none'
      })
    );

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'value',
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50
        }),
        tooltip: am5.Tooltip.new(root, {
          ...tooltipConfig
        })
      })
    );

    xAxis
      .get('tooltip')
      ?.get('background')
      ?.setAll({
        fill: am5.color(tailwindConfig.colors['yellow'][200]),
        stroke: am5.color(tailwindConfig.colors['yellow'][300])
      });
    xAxis.get('tooltip')?.label.setAll({
      fill: am5.color(tailwindConfig.colors['neutral'][700])
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    xAxis.get('renderer').labels.template.adapters.add('text', function (text, target: any) {
      if (target.dataItem) {
        return root.numberFormatter.format(Number(target.dataItem.get('category')), '#.###');
      }
      return text;
    });

    xAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(themeToUse.gridLine),
      opacity: 1
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.1,
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    yAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(themeToUse.gridLine),
      opacity: 1
    });

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    const cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        xAxis: xAxis
      })
    );
    cursor.lineY.set('visible', true);
    cursor.lineX.set('stroke', am5.color(themeToUse.gridLine));
    cursor.lineY.set('stroke', am5.color(themeToUse.gridLine));

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    const bidsTotalVolume = chart.series.push(
      am5xy.StepLineSeries.new(root, {
        minBulletDistance: 10,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'bidstotalvolume',
        categoryXField: 'value',
        stroke: am5.color(chartLinesColor),
        fill: am5.color(chartLinesColor),
        tooltip: am5.Tooltip.new(root, {
          autoTextColor: false,
          getFillFromSprite: false,
          getLabelFillFromSprite: false,
          pointerOrientation: 'down',
          labelText: '[width: 106px]Price:[/]{categoryX}[/]\n[width: 106px]Bids:[/]{valueY}[/]'
        })
      })
    );
    bidsTotalVolume.strokes.template.set('strokeWidth', 1);
    bidsTotalVolume.fills.template.setAll({
      visible: true,
      fillOpacity: 0.2
    });
    bidsTotalVolume
      .get('tooltip')
      ?.get('background')
      ?.setAll({
        fill: am5.color(tailwindConfig.colors['yellow'][200]),
        stroke: am5.color(tailwindConfig.colors['yellow'][300])
      });
    bidsTotalVolume.get('tooltip')?.label.setAll({
      fill: am5.color(tailwindConfig.colors['neutral'][700])
    });

    const asksTotalVolume = chart.series.push(
      am5xy.StepLineSeries.new(root, {
        minBulletDistance: 10,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'askstotalvolume',
        categoryXField: 'value',
        stroke: am5.color(chartLinesColor),
        fill: am5.color(chartLinesColor),
        tooltip: am5.Tooltip.new(root, {
          autoTextColor: false,
          getFillFromSprite: false,
          getLabelFillFromSprite: false,
          pointerOrientation: 'down',
          labelText: '[width: 120px]Price:[/]{categoryX}[/]\n[width: 120px]Listings:[/]{valueY}[/]'
        })
      })
    );
    asksTotalVolume.strokes.template.set('strokeWidth', 1);
    asksTotalVolume.fills.template.setAll({
      visible: true,
      fillOpacity: 0.2
    });
    asksTotalVolume
      .get('tooltip')
      ?.get('background')
      ?.setAll({
        fill: am5.color(tailwindConfig.colors['yellow'][200]),
        stroke: am5.color(tailwindConfig.colors['yellow'][300])
      });
    asksTotalVolume.get('tooltip')?.label.setAll({
      fill: am5.color(tailwindConfig.colors['neutral'][700])
    });

    const bidVolume = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        minBulletDistance: 10,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'bidsvolume',
        categoryXField: 'value',
        fill: am5.color(themeToUse.disabled)
      })
    );
    bidVolume.columns.template.set('fillOpacity', 1);
    bidVolume.columns.template.set('width', 1);
    bidVolume.columns.template.set('stroke', am5.color(chartLinesColor));

    const asksVolume = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        minBulletDistance: 10,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'asksvolume',
        categoryXField: 'value',
        fill: am5.color(themeToUse.disabled)
      })
    );
    asksVolume.columns.template.set('fillOpacity', 1);
    asksVolume.columns.template.set('width', 1);
    asksVolume.columns.template.set('stroke', am5.color(chartLinesColor));

    loadData();

    // Data loader
    function loadData() {
      const asks = dataToRender.sell.depth.map(function (item: { price: number; quantity: number }) {
        return [item.price, item.quantity];
      });
      const bids = dataToRender.buy.depth.map(function (item: { price: number; quantity: number }) {
        return [item.price, item.quantity];
      });

      parseData({
        asks: asks,
        bids: bids
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function parseData(data: { asks: any; bids: any }) {
      const res: unknown[] = [];
      processData(data.bids, 'bids', true, res);
      processData(data.asks, 'asks', false, res);
      xAxis.data.setAll(res);
      bidsTotalVolume.data.setAll(res);
      asksTotalVolume.data.setAll(res);
      bidVolume.data.setAll(res);
      asksVolume.data.setAll(res);
    }

    // Function to process (sort and calculate cummulative volume)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function processData(list: any[], type: string, desc: boolean, res: any[]) {
      // Convert to data points
      for (let i = 0; i < list.length; i++) {
        list[i] = {
          value: Number(list[i][0]),
          volume: Number(list[i][1])
        };
      }

      // Sort list just in case
      list.sort(function (a: { value: number }, b: { value: number }) {
        if (a.value > b.value) {
          return 1;
        } else if (a.value < b.value) {
          return -1;
        } else {
          return 0;
        }
      });

      // Calculate cumulative volume
      if (desc) {
        for (let i = list.length - 1; i >= 0; i--) {
          if (i < list.length - 1) {
            list[i].totalvolume = list[i + 1].totalvolume + list[i].volume;
          } else {
            list[i].totalvolume = list[i].volume;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dp = {} as any;
          dp['value'] = list[i].value;
          dp[type + 'volume'] = list[i].volume;
          dp[type + 'totalvolume'] = list[i].totalvolume;
          res.unshift(dp);
        }
      } else {
        for (let i = 0; i < list.length; i++) {
          if (i > 0) {
            list[i].totalvolume = list[i - 1].totalvolume + list[i].volume;
          } else {
            list[i].totalvolume = list[i].volume;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dp = {} as any;
          dp['value'] = list[i].value;
          dp[type + 'volume'] = list[i].volume;
          dp[type + 'totalvolume'] = list[i].totalvolume;
          res.push(dp);
        }
      }
    }

    return () => {
      root.dispose();
    };
  }, [darkMode]);
  return <div id="chartdiv" style={{ width: '100%', height: '100%' }}></div>;
};

export default OrderDepthChart;
