import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useTheme } from 'next-themes';
import { useLayoutEffect } from 'react';
import { ReservoirOrderDepth } from 'src/utils/types';
import tailwindConfig from '../../settings/tailwind/elements/foundations';
import { ChartBox } from './chart-box';

type Props = {
  data: { buy: ReservoirOrderDepth; sell: ReservoirOrderDepth };
};

const OrderDepthChart = ({ data }: Props) => {
  const showOutliers = true;

  return (
    <ChartBox className="h-full">
      <div className="flex justify-between mb-4">
        <div className="ml-5">
          <div className="font-medium mt-3 font-heading text-lg">Order Depth</div>
        </div>

        <div className="items-center flex space-x-6">
          <div className="flex items-center space-x-2">
            {/* <ASwitchButton
              checked={showOutliers}
              onChange={() => {
                setShowOutliers(!showOutliers);
              }}
            ></ASwitchButton> */}

            {/* <span className={twMerge('text-sm font-medium', secondaryTextColor)}>Outliers</span> */}
          </div>
        </div>
      </div>

      <OrderDepthChartSub data={data} hideOutliers={!showOutliers} key={String(showOutliers)} />
    </ChartBox>
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

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    const myTheme = am5.Theme.new(root);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commonConfig: any = {
      fill: am5.color(themeToUse.disabled),
      fontSize: '.75em',
      fontFamily: 'DM Sans',
      fontWeight: '800'
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
          ...commonConfig
        })
      })
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    xAxis.get('renderer').labels.template.adapters.add('text', function (text, target: any) {
      if (target.dataItem) {
        return root.numberFormatter.format(Number(target.dataItem.get('category')), '#.###');
      }
      return text;
    });

    xAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(themeToUse.disabledFade)
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.1,
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    yAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(themeToUse.disabledFade)
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
    cursor.lineX.set('stroke', am5.color(themeToUse.disabledFade));
    cursor.lineY.set('stroke', am5.color(themeToUse.disabledFade));

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    const bidsTotalVolume = chart.series.push(
      am5xy.StepLineSeries.new(root, {
        minBulletDistance: 10,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'bidstotalvolume',
        categoryXField: 'value',
        stroke: am5.color(tailwindConfig.colors['green'][500]),
        fill: am5.color(tailwindConfig.colors['green'][500]),
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: 'horizontal',
          labelText: '[width: 120px]Price:[/]{categoryX}[/]\n[width: 120px]Bids:[/]{valueY}[/]'
        })
      })
    );
    bidsTotalVolume.strokes.template.set('strokeWidth', 1);
    bidsTotalVolume.fills.template.setAll({
      visible: true,
      fillOpacity: 0.2
    });

    const asksTotalVolume = chart.series.push(
      am5xy.StepLineSeries.new(root, {
        minBulletDistance: 10,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'askstotalvolume',
        categoryXField: 'value',
        stroke: am5.color(tailwindConfig.colors['red'][500]),
        fill: am5.color(tailwindConfig.colors['red'][500]),
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: 'horizontal',
          labelText: '[width: 120px]Price:[/]{categoryX}[/]\n[width: 120px]Listings:[/]{valueY}[/]'
        })
      })
    );
    asksTotalVolume.strokes.template.set('strokeWidth', 1);
    asksTotalVolume.fills.template.setAll({
      visible: true,
      fillOpacity: 0.2
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
    bidVolume.columns.template.set('stroke', am5.color(tailwindConfig.colors['green'][500]));

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
    asksVolume.columns.template.set('stroke', am5.color(tailwindConfig.colors['red'][500]));

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
  }, []);
  return <div id="chartdiv" style={{ width: '100%', height: '100%' }}></div>;
};

export default OrderDepthChart;
