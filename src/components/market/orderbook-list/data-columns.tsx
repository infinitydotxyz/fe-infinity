export enum DataColumnType {
  Text,
  Currency
}

export interface DataColumn {
  name: string;
  type: DataColumnType;
  minWidth: number;
  maxWidth: number;
}

const defaultMinWidth = 40;
const defaultMaxWidth = 140;

export const defaultDataColumns: DataColumn[] = [
  {
    name: 'Type',
    type: DataColumnType.Text,
    minWidth: 100,
    maxWidth: defaultMaxWidth
  },
  {
    name: 'Min sale price',
    type: DataColumnType.Currency,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  {
    name: 'Number of NFT',
    type: DataColumnType.Text,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  {
    name: 'Expiration Date',
    type: DataColumnType.Text,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  }
];
