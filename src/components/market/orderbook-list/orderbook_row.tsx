import { OBOrder } from '@infinityxyz/lib/types/core';
import { EthPrice } from 'src/components/common/eth-price';
import { numStr } from 'src/utils';
import { DataColumn, DataColumnType, defaultDataColumns } from './data-columns';
import { OrderbookItem } from './orderbook_item';

type Props3 = {
  order: OBOrder;
};

export const OrderbookRow = ({ order }: Props3): JSX.Element => {
  const valueDiv = (dataColumn: DataColumn) => {
    const value = order.id;

    switch (dataColumn.type) {
      case DataColumnType.Text:
        return (
          <div className="flex flex-row items-center">
            {value ? <div className="truncate font-bold">{numStr(value)}</div> : <div>---</div>}
          </div>
        );
        break;
      case DataColumnType.Currency:
        return (
          <div className="flex flex-row items-center">
            <EthPrice label={numStr(value)} labelClassName="font-bold" />
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
    <div className={'rounded-3xl flex items-center mb-3 p-8 w-full bg-slate-100'}>
      <div className={'grid items-center relative w-full gap-5'} style={{ gridTemplateColumns: gridTemplate }}>
        <OrderbookItem order={order} image={true} />
        <OrderbookItem order={order} nameItem={true} />

        {defaultDataColumns.map((data) => {
          const content = valueDiv(data);

          // don't show title on progress bars
          const title = data.name;

          return <OrderbookItem key={Math.random()} title={title} order={order} content={content} />;
        })}
      </div>
    </div>
  );
};
