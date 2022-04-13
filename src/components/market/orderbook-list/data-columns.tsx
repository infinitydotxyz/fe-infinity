export enum DataColumnType {
  Amount = 'number',
  Change = 'change'
}

export interface DataColumn {
  name: string;
  isDisabled: boolean;
  type: DataColumnType;
  isSelected: boolean;
  unit?: string;
  minWidth: number;
  maxWidth: number;
}

const defaultMinWidth = 40;
const defaultMaxWidth = 140;

export const defaultDataColumns: DataColumn[] = [
  {
    name: 'Type',
    isSelected: true,
    isDisabled: false,
    type: DataColumnType.Amount,
    minWidth: 100,
    maxWidth: defaultMaxWidth
  },
  {
    name: 'Min sale price',
    isSelected: false,
    isDisabled: false,
    type: DataColumnType.Amount,
    unit: 'ETH',
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  {
    name: 'Number of NFT',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  {
    name: 'Expiration Date',
    isSelected: true,
    isDisabled: false,
    type: DataColumnType.Amount,
    unit: 'ETH',
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  }
];
