import { buildChartTheme } from '@visx/xychart';
import { textColor } from 'src/utils/ui-constants';
import tailwindConfig from '../../../settings/tailwind/elements/foundations';

export function useChartTheme() {
  const color = tailwindConfig.colors.brand.primaryFade;

  return {
    theme: buildChartTheme({
      // colors
      backgroundColor: '', // used by Tooltip, Annotation
      colors: [color], // categorical colors, mapped to series via `dataKey`s

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
