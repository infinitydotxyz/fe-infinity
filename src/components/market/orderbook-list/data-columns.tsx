export type DataColumnType = 'Name' | 'Text' | 'Currency';
export type DataColumnField = 'name' | 'type' | 'minSalePrice' | 'numNFTs' | 'expirationDate';

export interface DataColumn {
  name: string;
  type: DataColumnType;
  field: DataColumnField;
  width: string;
}

export const defaultDataColumns: DataColumn[] = [
  {
    name: 'Name',
    type: 'Name',
    field: 'name',
    width: '2fr'
  },
  {
    name: 'Type',
    type: 'Text',
    field: 'type',
    width: '1fr'
  },
  {
    name: 'Min sale price',
    type: 'Currency',
    field: 'minSalePrice',
    width: '1fr'
  },
  {
    name: 'Number of NFT',
    type: 'Text',
    field: 'numNFTs',
    width: '1fr'
  },
  {
    name: 'Expiration Date',
    type: 'Text',
    field: 'expirationDate',
    width: '1fr'
  }
];
