import { buildChartTheme } from '@visx/xychart';
import { useAppContext } from 'src/utils/context/AppContext';
import tailwindConfig from '../../../settings/tailwind/elements/foundations';

export function useChartTheme() {
  const { darkMode } = useAppContext();

  const theme = tailwindConfig.colors[darkMode ? 'dark' : 'light'];
  const color = darkMode ? '#FFFFFF' : '#000000';
  const colorGrid = theme.bg[darkMode ? 100 : 300];

  return {
    theme: buildChartTheme({
      // colors
      backgroundColor: theme.bg, // used by Tooltip, Annotation
      colors: [color], // categorical colors, mapped to series via `dataKey`s

      // labels
      svgLabelBig: { fill: color, fontSize: 16, fontWeight: 'bold' }, // label at bottom and side of the chart
      svgLabelSmall: { fill: darkMode ? '#AAAAAA' : color, fontSize: 14 }, // tick labels
      htmlLabel: {}, // text in tooltip

      // lines
      xAxisLineStyles: {},
      yAxisLineStyles: {},
      xTickLineStyles: {},
      yTickLineStyles: {},
      tickLength: 5,

      // grid
      gridColor: colorGrid,
      gridColorDark: colorGrid, // used for axis baseline if x/yxAxisLineStyles not set
      gridStyles: {}
    })
  };
}
