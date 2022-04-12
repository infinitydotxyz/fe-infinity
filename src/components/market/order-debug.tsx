import React, { useEffect, useState } from 'react';
import { Button } from 'src/components/common';
import { BuyOrderList, BuyOrderMatchList, SellOrderList } from 'src/components/market/order-list';
import { useAppContext } from 'src/utils/context/AppContext';
import {
  addBuy,
  addSell,
  executeBuyOrder,
  marketBuyOrders,
  marketDeleteOrder,
  marketMatches,
  marketSellOrders
} from 'src/utils/marketUtils';
import {
  BuyOrderMatch,
  MarketAction,
  MarketListId,
  MarketListingsBody,
  MarketOrder,
  OBOrder
} from '@infinityxyz/lib/types/core';
import { OrderModal } from 'src/components/market/order-modal';
import { RefreshIcon } from '@heroicons/react/outline';
import { iconButtonStyle } from './order-drawer/ui-constants';

export function OrderDebug() {
  const [buyOrders, setBuyOrders] = useState<OBOrder[]>([]);
  const [sellOrders, setSellOrders] = useState<OBOrder[]>([]);
  const [matchOrders, setMatchOrders] = useState<BuyOrderMatch[]>([]);
  const { showAppError, showAppMessage, user, providerManager } = useAppContext();
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
    // crashes
    // const signer = providerManager.getEthersProvider().getSigner();
    // await prepareOBOrder(user, chainId, signer, order);

    const match = await addBuy(order);

    if (match) {
      setMatchOrders(match);

      showAppMessage('Buy successful');
    } else {
      showAppError('Buy submitted');
    }
  };

  const listBuyOrders = async () => {
    await _listBuyOrders(MarketListId.ValidActive);
  };

  const listBuyOrdersValidInactive = async () => {
    await _listBuyOrders(MarketListId.ValidInactive);
  };

  const listBuyOrdersInvalid = async () => {
    await _listBuyOrders(MarketListId.Invalid);
  };

  const _listBuyOrders = async (listId: MarketListId) => {
    const match = await marketBuyOrders(listId);

    if (match) {
      const orders: OBOrder[] = match;

      switch (listId) {
        case MarketListId.ValidActive:
          setBuyOrders(orders);
          break;
        case MarketListId.Invalid:
          setBuyOrdersInvalid(orders);
          break;
        case MarketListId.ValidInactive:
          setBuyOrdersValidInactive(orders);
          break;
        default:
          console.log('hit default case');
      }
    } else {
      showAppError('An error occurred: listBuyOrders');
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
    await _listSellOrders(MarketListId.ValidActive);
  };

  const listSellOrdersValidInactive = async () => {
    await _listSellOrders(MarketListId.ValidInactive);
  };

  const listSellOrdersInvalid = async () => {
    await _listSellOrders(MarketListId.Invalid);
  };

  const _listSellOrders = async (listId: MarketListId) => {
    const match = await marketSellOrders(listId);

    if (match) {
      const orders: OBOrder[] = match;

      switch (listId) {
        case MarketListId.ValidActive:
          setSellOrders(orders);
          break;
        case MarketListId.Invalid:
          setSellOrdersInvalid(orders);
          break;
        case MarketListId.ValidInactive:
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

  const listMatchedOrders = async () => {
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
    listMatchedOrders();
    listBuyOrders();
    listSellOrders();
  };

  const refreshInactiveLists = async () => {
    listBuyOrdersValidInactive();
    listBuyOrdersInvalid();
    listSellOrdersValidInactive();
    listSellOrdersInvalid();
  };

  const handleAcceptClick = async (buyOrder: OBOrder) => {
    await executeBuyOrder(buyOrder.id ?? '');

    refreshActiveLists();
    refreshInactiveLists();
  };

  const handleCardClick = async (order: OBOrder, action: string, listId: MarketListId) => {
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
        // eslint-disable-next-line
        const body: MarketListingsBody = {
          orderType: !order.isSellOrder ? MarketOrder.BuyOrders : MarketOrder.SellOrders,
          action: MarketAction.Delete,
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
      <OrderModal
        inOrder={clickedOrder}
        buyMode={buyMode}
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
    <div>
      <div className={'xx'}>
        <div className="xx">
          {buttons}

          {/* === Buy Orders === */}
          <Header title="Buy Orders" onClick={() => listBuyOrders()} />
          {buyOrders.length > 0 && (
            <>
              <BuyOrderList
                orders={buyOrders}
                onClickAction={(order, action) => handleCardClick(order, action, MarketListId.ValidActive)}
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
                onClickAction={(order, action) => handleCardClick(order, action, MarketListId.ValidActive)}
              />
            </>
          )}
          {sellOrders.length === 0 && <NothingFound />}

          {/* === Match Orders === */}
          <Header title="Matched Orders" onClick={() => listMatchedOrders()} />
          {matchOrders.length > 0 && (
            <>
              <BuyOrderMatchList
                matches={matchOrders}
                onBuyClick={(order, action) => handleCardClick(order, action, MarketListId.ValidActive)}
                onSellClick={(order, action) => handleCardClick(order, action, MarketListId.ValidActive)}
                onAcceptClick={handleAcceptClick}
              />
            </>
          )}
          {matchOrders.length === 0 && <NothingFound />}

          {/* === Buy Orders (validInactive) === */}
          <Header title="Buy Orders (validInactive)" onClick={() => listBuyOrdersValidInactive()} />
          {buyOrdersValidInactive.length > 0 && (
            <>
              <BuyOrderList
                orders={buyOrdersValidInactive}
                onClickAction={(order, action) => handleCardClick(order, action, MarketListId.ValidInactive)}
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
                onClickAction={(order, action) => handleCardClick(order, action, MarketListId.Invalid)}
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
                onClickAction={(order, action) => handleCardClick(order, action, MarketListId.ValidInactive)}
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
                onClickAction={(order, action) => handleCardClick(order, action, MarketListId.Invalid)}
              />
            </>
          )}
          {sellOrdersInvalid.length === 0 && <NothingFound />}
        </div>

        {modalComponent(true)}
        {modalComponent(false)}
      </div>
    </div>
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

const Header = ({ title, onClick }: Props2): JSX.Element => {
  return (
    <div className={'my-4 flex justify-center items-center'}>
      <div className={'text-center text-md bold'}>{title}</div>

      <Button size="small" variant="ghost" onClick={onClick}>
        <RefreshIcon className={iconButtonStyle} />
      </Button>
    </div>
  );
};
