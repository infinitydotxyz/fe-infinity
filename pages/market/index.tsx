import React, { useEffect, useState } from 'react';
import { Button, PageBox } from 'src/components/common';
import { OrderDrawer } from 'src/components/market/order-drawer';
import { BuyOrderList, SellOrderList } from 'src/components/market/order-list';
import { useAppContext } from 'src/utils/context/AppContext';
import {
  addBuy,
  addSell,
  marketBuyOrders,
  marketDeleteOrder,
  marketMatches,
  marketSellOrders
} from 'src/utils/marketUtils';
import { BuyOrderMatch, MarketListIdType, MarketListingsBody, OBOrder } from '@infinityxyz/lib/types/core';
import { prepareOBOrder } from 'src/utils/exchange/orders';
import { MarketOrderModal } from 'src/components/market/market-order-modal';

export default function MarketPage() {
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [buyOrders, setBuyOrders] = useState<OBOrder[]>([]);
  const [sellOrders, setSellOrders] = useState<OBOrder[]>([]);
  const [matchOrders, setMatchOrders] = useState<BuyOrderMatch[]>([]);
  const { showAppError, showAppMessage, chainId, user, providerManager } = useAppContext();
  const [buyModalShown, setBuyModalShown] = useState(false);
  const [sellModalShown, setSellModalShown] = useState(false);

  const [buyOrdersValidInactive, setBuyOrdersValidInactive] = useState<OBOrder[]>([]);
  const [buyOrdersInvalid, setBuyOrdersInvalid] = useState<OBOrder[]>([]);
  const [sellOrdersValidInactive, setSellOrdersValidInactive] = useState<OBOrder[]>([]);
  const [sellOrdersInvalid, setSellOrdersInvalid] = useState<OBOrder[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [clickedOrder, setClickedOrder] = useState<OBOrder>();

  useEffect(() => {
    if (user) {
      refreshActiveLists();
    }
  }, [user]);

  // ===========================================================

  // buy orders

  const buy = async (order: OBOrder) => {
    if (!user || !providerManager) {
      console.error('no user or provider');
      return;
    }
    const signer = providerManager.getEthersProvider().getSigner();
    await prepareOBOrder(user, chainId, signer, order);

    const match = await addBuy(order);

    if (match) {
      setMatchOrders(match);

      showAppMessage('Buy successful');
    } else {
      showAppError('Buy submitted');
    }
  };

  const listBuyOrders = async () => {
    await _listBuyOrders('validActive');
  };

  const listBuyOrdersValidInactive = async () => {
    await _listBuyOrders('validInactive');
  };

  const listBuyOrdersInvalid = async () => {
    await _listBuyOrders('invalid');
  };

  const _listBuyOrders = async (listId: MarketListIdType) => {
    const match = await marketBuyOrders(listId);

    if (match) {
      const orders: OBOrder[] = match;

      switch (listId) {
        case 'validActive':
          setBuyOrders(orders);
          break;
        case 'invalid':
          setBuyOrdersInvalid(orders);
          break;
        case 'validInactive':
          setBuyOrdersValidInactive(orders);
          break;
        default:
          console.log('hit default case');
      }
    } else {
      showAppError('An error occured: listBuyOrders');
    }
  };

  // ===========================================================
  // sell orders

  const sell = async (order: OBOrder) => {
    const match = await addSell(order);
    if (match) {
      setMatchOrders(match);
      showAppMessage('sell successful.');
    } else {
      showAppMessage('sell submitted');
    }
  };

  const listSellOrders = async () => {
    await _listSellOrders('validActive');
  };

  const listSellOrdersValidInactive = async () => {
    await _listSellOrders('validInactive');
  };

  const listSellOrdersInvalid = async () => {
    await _listSellOrders('invalid');
  };

  const _listSellOrders = async (listId: MarketListIdType) => {
    const match = await marketSellOrders(listId);

    if (match) {
      const orders: OBOrder[] = match;

      switch (listId) {
        case 'validActive':
          setSellOrders(orders);
          break;
        case 'invalid':
          setSellOrdersInvalid(orders);
          break;
        case 'validInactive':
          setSellOrdersValidInactive(orders);
          break;
        default:
          console.log('hit default case');
      }
    } else {
      showAppError('An error occured: listSellOrders');
    }
  };

  // ===========================================================
  // matching orders

  const listMatcheOrders = async () => {
    const matches = await marketMatches();

    setMatchOrders(matches);
  };

  const deleteOrder = async (body: MarketListingsBody) => {
    const response = await marketDeleteOrder(body);

    if (response) {
      showAppMessage(response);
    }
  };

  const buttons = (
    <div className={'xx'}>
      <Button
        onClick={async () => {
          setClickedOrder(undefined);

          setBuyModalShown(true);
        }}
      >
        Buy
      </Button>

      <Button
        onClick={async () => {
          setClickedOrder(undefined);

          setSellModalShown(true);
        }}
      >
        Sell
      </Button>

      <Button
        onClick={async () => {
          refreshAllLists();
        }}
      >
        Refresh
      </Button>
    </div>
  );

  const refreshAllLists = async () => {
    refreshActiveLists();
    refreshInactiveLists();
  };

  const refreshActiveLists = async () => {
    listMatcheOrders();
    listBuyOrders();
    listSellOrders();
  };

  const refreshInactiveLists = async () => {
    listBuyOrdersValidInactive();
    listBuyOrdersInvalid();
    listSellOrdersValidInactive();
    listSellOrdersInvalid();
  };

  // const handleAcceptClick = async (buyOrder: OBOrder) => {
  //   await executeBuyOrder(buyOrder.id ?? '');

  //   refreshActiveLists();
  //   refreshInactiveLists();
  // };

  const handleCardClick = async (order: OBOrder, action: string, listId: MarketListIdType) => {
    switch (action) {
      case 'card':
        setClickedOrder(order);

        if (!order.isSellOrder) {
          setBuyModalShown(true);
        } else {
          setSellModalShown(true);
        }
        break;
      case 'delete':
        const body: MarketListingsBody = {
          orderType: !order.isSellOrder ? 'buyOrders' : 'sellOrders',
          action: 'delete',
          listId: listId,
          orderId: order.id
        };

        await deleteOrder(body);

        if (!order.isSellOrder) {
          listBuyOrders();
        } else {
          listSellOrders();
        }

        // could be inactive list
        refreshInactiveLists();

        // clear this
        setMatchOrders([]);
        break;
      default:
        console.log(`not handled: ${action}`);
        break;
    }
  };

  const modalComponent = (buyMode: boolean) => {
    return (
      <MarketOrderModal
        inOrder={clickedOrder}
        isOpen={buyMode ? buyModalShown : sellModalShown}
        onClose={async (obOrder) => {
          if (buyMode) {
            setBuyModalShown(false);

            if (obOrder) {
              await buy(obOrder);

              listBuyOrders();
            }
          } else {
            setSellModalShown(false);

            if (obOrder) {
              await sell(obOrder);

              listSellOrders();
            }
          }
        }}
      />
    );
  };

  return (
    <PageBox
      title="Market"
      rightSide={
        <Button
          onClick={async () => {
            setCartOpen(!cartOpen);
          }}
        >
          Cart
        </Button>
      }
    >
      <OrderDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <div className={'xx'}>
        <div className="xx">
          {buttons}

          {/* === Buy Orders === */}
          <Header title="Buy Orders" onClick={() => listBuyOrders()} />
          {buyOrders.length > 0 && (
            <>
              <BuyOrderList
                orders={buyOrders}
                onClickAction={(order, action) => handleCardClick(order, action, 'validActive')}
              />
            </>
          )}
          {buyOrders.length === 0 && <NothingFound />}

          {/* === Sell Orders === */}
          <Header title="Sell Orders" onClick={() => listSellOrders()} />
          {sellOrders.length > 0 && (
            <>
              <SellOrderList
                orders={sellOrders}
                onClickAction={(order, action) => handleCardClick(order, action, 'validActive')}
              />
            </>
          )}
          {sellOrders.length === 0 && <NothingFound />}

          {/* === Match Orders === */}
          <Header title="Matched Orders" onClick={() => listMatcheOrders()} />
          {matchOrders.length > 0 && (
            <>
              {/* <BuyOrderMatchList
                matches={matchOrders}
                onBuyClick={(order, action) => handleCardClick(order, action, 'validActive')}
                onSellClick={(order, action) => handleCardClick(order, action, 'validActive')}
                onAcceptClick={handleAcceptClick}
              /> */}
            </>
          )}
          {matchOrders.length === 0 && <NothingFound />}

          {/* === Buy Orders (validInactive) === */}
          <Header title="Buy Orders (validInactive)" onClick={() => listBuyOrdersValidInactive()} />
          {buyOrdersValidInactive.length > 0 && (
            <>
              <BuyOrderList
                orders={buyOrdersValidInactive}
                onClickAction={(order, action) => handleCardClick(order, action, 'validInactive')}
              />
            </>
          )}
          {buyOrdersValidInactive.length === 0 && <NothingFound />}

          {/* === Buy Orders (Invalid) === */}
          <Header title="Buy Orders (Invalid)" onClick={() => listBuyOrdersInvalid()} />
          {buyOrdersInvalid.length > 0 && (
            <>
              <BuyOrderList
                orders={buyOrdersInvalid}
                onClickAction={(order, action) => handleCardClick(order, action, 'invalid')}
              />
            </>
          )}
          {buyOrdersInvalid.length === 0 && <NothingFound />}

          {/* === Sell Orders (validInactive) === */}
          <Header title="Sell Orders (validInactive)" onClick={() => listSellOrdersValidInactive()} />
          {sellOrdersValidInactive.length > 0 && (
            <>
              <SellOrderList
                orders={sellOrdersValidInactive}
                onClickAction={(order, action) => handleCardClick(order, action, 'validInactive')}
              />
            </>
          )}
          {sellOrdersValidInactive.length === 0 && <NothingFound />}

          {/* === Sell Orders (Invalid) === */}
          <Header title="Sell Orders (Invalid)" onClick={() => listSellOrdersInvalid()} />
          {sellOrdersInvalid.length > 0 && (
            <>
              <SellOrderList
                orders={sellOrdersInvalid}
                onClickAction={(order, action) => handleCardClick(order, action, 'invalid')}
              />
            </>
          )}
          {sellOrdersInvalid.length === 0 && <NothingFound />}
        </div>

        {modalComponent(true)}
        {modalComponent(false)}
      </div>
    </PageBox>
  );
}

// =====================================================

const NothingFound = (): JSX.Element => {
  return (
    <div className={'flex flex-col content-center items-center text-sm'}>
      <div className={'py-1 px-2 border-2 border-gray-200'}>Nothing Found</div>
    </div>
  );
};

interface Props2 {
  title: string;
  onClick: () => void;
}

const Header = ({ title }: Props2): JSX.Element => {
  return (
    <div className={'my-4 flex flex-col content-center items-center'}>
      <div className={'text-center text-md bold'}>{title}</div>

      {/* <IconButton aria-label="" variant="ghost" icon={<RepeatIcon />} isRound onClick={onClick} /> */}
    </div>
  );
};
