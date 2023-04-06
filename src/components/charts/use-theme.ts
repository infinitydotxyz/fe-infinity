import { buildChartTheme } from '@visx/xychart';
import { bidDataPointColor, listingDataPointColor, textColor } from 'src/utils/ui-constants';

export function useListingsChartTheme() {
  return {
    theme: buildChartTheme({
      // colors
      backgroundColor: '', // used by Tooltip, Annotation
      colors: [listingDataPointColor], // categorical colors, mapped to series via `dataKey`s

      // labels
      svgLabelBig: { fill: textColor, fontSize: 12, fontWeight: 'normal' }, // label at bottom and side of the chart
      svgLabelSmall: { fill: textColor, fontSize: 12 }, // tick labels
      htmlLabel: {}, // text in tooltip

      // lines
      xAxisLineStyles: {},
      yAxisLineStyles: {},
      xTickLineStyles: {},
      yTickLineStyles: {},
      tickLength: 5,

      // grid
      gridColor: textColor,
      gridColorDark: textColor, // used for axis baseline if x/yxAxisLineStyles not set
      gridStyles: {}
    })
  };
}

export function useBidsChartTheme() {
  return {
    theme: buildChartTheme({
      // colors
      backgroundColor: '', // used by Tooltip, Annotation
      colors: [bidDataPointColor], // categorical colors, mapped to series via `dataKey`s

      // labels
      svgLabelBig: { fill: textColor, fontSize: 12, fontWeight: 'normal' }, // label at bottom and side of the chart
      svgLabelSmall: { fill: textColor, fontSize: 12 }, // tick labels
      htmlLabel: {}, // text in tooltip

      // lines
      xAxisLineStyles: {},
      yAxisLineStyles: {},
      xTickLineStyles: {},
      yTickLineStyles: {},
      tickLength: 5,

      // grid
      gridColor: textColor,
      gridColorDark: textColor, // used for axis baseline if x/yxAxisLineStyles not set
      gridStyles: {}
    })
  };
}
