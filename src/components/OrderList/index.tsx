import React from 'react';
import { uuidv4 } from 'utils/commonUtil';
import styles from './styles.module.scss';
import { OBOrder } from '@infinityxyz/lib/types/core';
import { Button } from 'components';

// =======================================================

type Props = {
  orders: OBOrder[];
  onClickAction: (order: OBOrder, action: string) => void;
};

export const BuyOrderList = ({ orders, onClickAction }: Props): JSX.Element => {
  return (
    <div className={styles.cardList}>
      {(orders || []).map((order) => {
        if (!order) {
          return null;
        }

        return <BuyOrderCard key={uuidv4()} order={order} onClickAction={onClickAction} />;
      })}
    </div>
  );
};

// =======================================================

type Props2 = {
  order: OBOrder;
  onClickAction: (order: OBOrder, action: string) => void;
};

const BuyOrderCard = ({ order, onClickAction }: Props2): JSX.Element => {
  // const addresses = order.collectionAddresses.map((e) => e.address);
  // const names = order.collectionAddresses.map((e) => e.name);

  // const classes = isOrderExpired(order) ? styles.expiredCard : styles.buyCard;
  const classes = styles.buyCard;

  return (
    <div className={classes} onClick={() => onClickAction(order, 'card')}>
      <div className={styles.title}>Buy Order</div>
      {/* <div>budget: {order.budget}</div>
      <div>collectionAddresses: {addresses.join(', ')}</div>
      <div>collectionNames: {names.join(', ')}</div>
      <div>minNFTs: {order.minNFTs}</div>
      <div>chainId: {order.chainId}</div>
      <div>startTime: {new Date(order.startTime * 1000).toLocaleString()}</div>
      <div>endTime: {new Date(order.endTime * 1000).toLocaleString()}</div>
      <div>user: {order.user}</div>
      <div>id: {order.id}</div>
      <div>expired: {isOrderExpired(order) ? 'YES' : 'NO'}</div> */}

      <div className={styles.cardButtons}>
        <Button
          onClick={() => {
            onClickAction(order, 'delete');
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

// =======================================================

type Props10 = {
  orders: OBOrder[];
  onClickAction: (order: OBOrder, action: string) => void;
};

export const SellOrderList = ({ orders, onClickAction }: Props10): JSX.Element => {
  return (
    <div className={styles.cardList}>
      {(orders || []).map((order) => {
        if (!order) {
          return null;
        }

        return <SellOrderCard key={uuidv4()} order={order} onClickAction={onClickAction} />;
      })}
    </div>
  );
};

// =======================================================

type Props11 = {
  order: OBOrder;
  onClickAction: (order: OBOrder, action: string) => void;
};

const SellOrderCard = ({ order, onClickAction }: Props11): JSX.Element => {
  //   const currentPrice = getCurrentOrderPrice(order);

  // const classes = isOrderExpired(order) ? styles.expiredCard : styles.sellCard;
  const classes = styles.sellCard;

  return (
    <div className={classes} onClick={() => onClickAction(order, 'card')}>
      <div className={styles.title}>Sell Order</div>
      {/* <div>currentPrice: {currentPrice}</div>
      <div>startPrice: {order.startPrice}</div>
      <div>endPrice: {order.endPrice}</div>
      <div>tokenName: {order.tokenName}</div>
      <div>tokenId: {order.tokenId}</div>
      <div>collectionAddress: {order.collectionAddress.address}</div>
      <div>collectionName: {order.collectionAddress.name}</div>
      <div>chainId: {order.chainId}</div>
      <div>startTime: {new Date(order.startTime * 1000).toLocaleString()}</div>
      <div>endTime: {new Date(order.endTime * 1000).toLocaleString()}</div>
      <div>user: {order.user}</div>
      <div>id: {order.id}</div>
      <div>expired: {isOrderExpired(order) ? 'YES' : 'NO'}</div> */}

      <div className={styles.cardButtons}>
        <Button
          onClick={() => {
            onClickAction(order, 'delete');
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

// =======================================================

// type Props20 = {
//   matches: BuyOrderMatch[];
//   onSellClick: (order: OBOrder, action: string) => void;
//   onBuyClick: (order: OBOrder, action: string) => void;
//   onAcceptClick: (order: OBOrder) => void;
// };

// export const BuyOrderMatchList = ({ matches, onAcceptClick, onBuyClick, onSellClick }: Props20): JSX.Element => {
//   if (matches.length === 0) {
//     return <></>;
//   }

//   return (
//     <>
//       {matches.map((match) => {
//         return (
//           <div key={uuidv4()}>
//             <BuyOrderMatchCard
//               key={uuidv4()}
//               match={match}
//               onBuyClick={onBuyClick}
//               onSellClick={onSellClick}
//               onAcceptClick={onAcceptClick}
//             />
//           </div>
//         );
//       })}
//     </>
//   );
// };

// =======================================================

// type Props21 = {
//   match: BuyOrderMatch;
//   onSellClick: (order: OBOrder, action: string) => void;
//   onBuyClick: (order: OBOrder, action: string) => void;
//   onAcceptClick: (order: OBOrder) => void;
// };

// const BuyOrderMatchCard = ({ match, onAcceptClick, onSellClick, onBuyClick }: Props21): JSX.Element => {
//   let buyCard;
//   if (match.buyOrder) {
//     buyCard = <BuyOrderCard order={match.buyOrder} onClickAction={onBuyClick} />;
//   }

//   return (
//     <div className={styles.matchCard}>
//       <div className={styles.acceptButton}>
//         <Button variant="ghost" backgroundColor="transparent" size="sm" onClick={() => onAcceptClick(match.buyOrder)}>
//           Accept
//         </Button>
//       </div>

//       <div>Buy Order</div>
//       {buyCard}

//       <div>Sell Orders</div>

//       {match.sellOrders && match.sellOrders.length > 0 && (
//         <SellOrderList orders={match.sellOrders} onClickAction={onSellClick} />
//       )}
//     </div>
//   );
// };
