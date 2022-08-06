import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';

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
  onClick?: () => void;
}

export const defaultDataColumns = (order: SignedOBOrder): DataColumn[] => {
  const router = useRouter();
  return [
    {
      name: 'Name',
      type: 'Name',
      field: 'name',
      width: '2fr',
      onClick: () => {
        // console.log('order', order);
        // const maker = order.makerUsername || order.makerAddress;
        // router.push(`/profile/${maker}`);
      }
    },
    {
      name: 'Event',
      type: 'Text',
      field: 'type',
      width: '1fr'
    },
    {
      name: 'Price', // order.isSellOrder ? 'Min sale price' : 'Max buy price',
      type: 'Currency',
      field: order.isSellOrder ? 'minSalePrice' : 'maxBuyPrice',
      width: '1fr'
    },
    {
      name: '# NFTs',
      type: 'Text',
      field: 'numNFTs',
      width: '1fr'
    },
    {
      name: 'From',
      type: 'Text',
      field: 'makerUsername',
      width: '1fr',
      onClick: () => {
        const maker = order.makerUsername || order.makerAddress;
        router.push(`/profile/${maker}`);
      }
    },
    {
      name: 'Expiry',
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
      width: '1fr'
    }
  ];
};
