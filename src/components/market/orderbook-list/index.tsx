import { OBOrder } from '@infinityxyz/lib/types/core';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Button } from 'src/components/common';
import { numStr } from 'src/utils';
import { BuyOrderList, SellOrderList } from '../order-list';
import { useOrderPager } from '../useOrderPager';
import { DataColumn, DataColumnType, defaultDataColumns } from './data-columns';
import styles from './styles.module.scss';

export const OrderbookList = (): JSX.Element => {
  const { buyOrders, sellOrders, fetchMore, isLoading } = useOrderPager(true, 4);

  return (
    <>
      <div className={styles.list}>
        {buyOrders.map((order: OBOrder) => {
          return <TrendingRow key={Math.random()} order={order} />;
        })}

        <BuyOrderList
          orders={buyOrders}
          onClickAction={() => {
            console.log('click');
          }}
        />

        <SellOrderList
          orders={sellOrders}
          onClickAction={() => {
            console.log('click');
          }}
        />

        {isLoading && <div>Loading</div>}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outline"
          onClick={() => {
            fetchMore();
          }}
        >
          More
        </Button>
      </div>
    </>
  );
};

// ====================================================================

type Props3 = {
  order: OBOrder;
};

export const TrendingRow = ({ order }: Props3): JSX.Element => {
  const valueDiv = (dataColumn: DataColumn) => {
    const value = order.id;

    switch (dataColumn.type) {
      case DataColumnType.Amount:
        return (
          <div className="flex flex-row items-center">
            {/* {dataColumn.unit === 'ETH' && <EthCurrencyIcon style={{ marginRight: '6px', fontWeight: 'bold' }} />} */}

            {value ? <div className={styles.itemValue}>{numStr(value)}</div> : <div>---</div>}
          </div>
        );

      default:
        return <></>;
    }
  };

  // build dynamic grid based on columns shown
  // 60px for image, next is name
  let gridTemplate = '50px minmax(120px, 220px)';

  defaultDataColumns.forEach((data) => {
    gridTemplate += ` minmax(${data.minWidth}px, ${data.maxWidth}px)`;
  });

  return (
    <div className={styles.row}>
      <div className={styles.gridRow} style={{ gridTemplateColumns: gridTemplate }}>
        <TrendingItem order={order} image={true} />
        <TrendingItem order={order} nameItem={true} />

        {defaultDataColumns.map((data) => {
          const content = valueDiv(data);

          // don't show title on progress bars
          const title = data.name;

          return <TrendingItem key={Math.random()} title={title} order={order} content={content} />;
        })}
      </div>
    </div>
  );
};

// ====================================================================

type Props4 = {
  content?: ReactNode;
  title?: string;
  order: OBOrder;
  nameItem?: boolean;
  image?: boolean;
  sortClick?: () => void;
};

export const TrendingItem = ({ title, content, image, nameItem, order }: Props4): JSX.Element => {
  if (nameItem) {
    return (
      <div className={styles.item}>
        <Link passHref href={`/collection/${order.id}`}>
          <div className={styles.itemTitle}>{'trendingData.name'}</div>
        </Link>
      </div>
    );
  }

  if (image) {
    return (
      <div className={styles.item}>
        <div className={styles.imageCropper}>
          <img alt={'collection image'} src="https://picsum.photos/id/1027/200" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.item}>
      {title}

      {content}
    </div>
  );
};
