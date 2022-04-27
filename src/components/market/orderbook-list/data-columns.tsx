import { OBOrder } from '@infinityxyz/lib/types/core';

export type DataColumnType = 'Name' | 'Text' | 'Currency' | 'Button';
export type DataColumnField =
  | 'name'
  | 'type'
  | 'minSalePrice'
  | 'maxBuyPrice'
  | 'numNFTs'
  | 'makerUsername'
  | 'expirationDate'
  | 'datePlaced'
  | 'buyOrSell';

export interface DataColumn {
  name: string;
  type: DataColumnType;
  field: DataColumnField;
  width: string;
}

export const defaultDataColumns = (order: OBOrder): DataColumn[] => {
  return [
    {
      name: 'Name',
      type: 'Name',
      field: 'name',
      width: '2fr'
    },
    {
      // TODO look into issues with changing field name
      name: 'Event',
      type: 'Text',
      field: 'type',
      width: '1fr'
    },
    {
      name: order.isSellOrder ? 'Min sale price' : 'Max buy price',
      type: 'Currency',
      field: order.isSellOrder ? 'minSalePrice' : 'maxBuyPrice',
      width: '1fr'
    },
    {
      name: 'NFT Amount',
      type: 'Text',
      field: 'numNFTs',
      width: '1fr'
    },
    {
      name: 'From',
      type: 'Text',
      field: 'makerUsername',
      width: '1fr'
    },
    {
      name: 'Expiry Date',
      type: 'Text',
      field: 'expirationDate',
      width: '1fr'
    },
    {
      name: 'Date',
      type: 'Text',
      field: 'datePlaced',
      width: '1fr'
    },
    {
      name: 'Button',
      type: 'Button',
      field: 'buyOrSell',
      width: '.5fr'
    }
  ];
};
