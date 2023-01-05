import { getAddress } from '@ethersproject/address';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { ReactNode, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { AButton, ARoundButton, ATextButton } from 'src/components/astra/astra-button';
import { EZImage, Spacer, TextInputBox } from 'src/components/common';
import { CART_TYPE, getCartType, getCollectionKeyId, getDefaultOrderExpiryTime, getTokenKeyId } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { infoBoxBGClr, smallIconButtonStyle, textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ADropdown } from './astra-dropdown';
import { Erc721CollectionOffer, Erc721TokenOffer, ORDER_EXPIRY_TIME } from './types';

interface Props {
  collections: Erc721CollectionOffer[];
  tokens: Erc721TokenOffer[];
  orders: SignedOBOrder[];
  onCollsRemove: (coll?: Erc721CollectionOffer) => void;
  onTokensRemove: (token?: Erc721TokenOffer) => void;
  onOrdersRemove: (order?: SignedOBOrder) => void;
  onCheckout: () => void;
  onTokenSend: (toAddress: string) => void;
}

export const AstraCart = ({
  tokens,
  collections,
  orders,
  onTokensRemove,
  onCollsRemove,
  onOrdersRemove,
  onCheckout,
  onTokenSend
}: Props) => {
  const tokenMap = new Map<string, Erc721TokenOffer[]>();
  const collMap = new Map<string, Erc721CollectionOffer[]>();
  const ordersMap = new Map<string, SignedOBOrder[]>();
  const [sendToAddress, setSendToAddress] = useState('');
  const { user, getEthersProvider, chainId } = useOnboardContext();

  for (const token of tokens) {
    const tkns = tokenMap.get(token.tokenAddress ?? '') ?? [];
    tkns.push(token);
    tokenMap.set(token.tokenAddress ?? '', tkns);
  }

  for (const coll of collections) {
    const colls = collMap.get(getCollectionKeyId(coll) ?? '') ?? [];
    colls.push(coll);
    collMap.set(getCollectionKeyId(coll) ?? '', colls);
  }

  for (const order of orders) {
    const ords = ordersMap.get(order.id ?? '') ?? [];
    ords.push(order);
    ordersMap.set(order.id ?? '', ords);
  }

  let clearButton = <></>;

  if (tokens.length > 0) {
    clearButton = (
      <div className="flex items-center">
        <div className="bg-gray-300 rounded-full h-6 w-6 text-center mr-1 ">{tokens.length}</div>
        <ATextButton
          className="px-2 rounded-lg text-gray-500 text-sm"
          onClick={() => {
            onTokensRemove();
          }}
        >
          Clear
        </ATextButton>
      </div>
    );
  }

  if (collections.length > 0) {
    clearButton = (
      <div className="flex items-center">
        <div className="bg-gray-300 rounded-full h-6 w-6 text-center mr-1 ">{collections.length}</div>
        <ATextButton
          className="px-2 rounded-lg text-gray-500 text-sm"
          onClick={() => {
            onCollsRemove();
          }}
        >
          Clear
        </ATextButton>
      </div>
    );
  }

  if (orders.length > 0) {
    clearButton = (
      <div className="flex items-center">
        <div className="bg-gray-300 rounded-full h-6 w-6 text-center mr-1 ">{orders.length}</div>
        <ATextButton
          className="px-2 rounded-lg text-gray-500 text-sm"
          onClick={() => {
            onOrdersRemove();
          }}
        >
          Clear
        </ATextButton>
      </div>
    );
  }

  let checkoutBtnText = 'Place Order';
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const cartType = getCartType(url);
  if (cartType === CART_TYPE.LIST) {
    if (tokens.length > 1) {
      checkoutBtnText = 'Bulk List';
    } else {
      checkoutBtnText = 'List';
    }
  } else if (cartType === CART_TYPE.BID) {
    if (tokens.length || collections.length > 1) {
      checkoutBtnText = 'Bulk Bid';
    } else {
      checkoutBtnText = 'Bid';
    }
  } else if (cartType === CART_TYPE.SEND) {
    checkoutBtnText = 'Send';
  } else if (cartType === CART_TYPE.CANCEL) {
    if (orders.length > 1) {
      checkoutBtnText = 'Cancel Orders';
    } else {
      checkoutBtnText = 'Cancel Order';
    }
  }

  let listComponent;

  if (tokenMap.size > 0) {
    const divList: ReactNode[] = [];
    let index = 0;
    tokenMap.forEach((tokenArray) => {
      const first = tokenArray[0];

      divList.push(
        <div className="w-full rounded-md font-bold truncate" key={`header-${first.id}`}>
          {first.collectionName}
        </div>
      );

      for (const t of tokenArray) {
        if (cartType === CART_TYPE.SEND) {
          divList.push(
            <AstraSendCartItem key={getTokenKeyId(t)} token={t} index={index++} onRemove={onTokensRemove} />
          );
        } else {
          divList.push(
            <AstraTokenCartItem key={getTokenKeyId(t)} token={t} index={index++} onRemove={onTokensRemove} />
          );
        }
      }

      divList.push(<div key={Math.random()} className="h-1" />);
    });

    // min-w-0 is important. otherwise text doesn't truncate
    listComponent = (
      <div className={twMerge(textClr, 'min-w-0 flex px-6 flex-col space-y-2 items-start flex-1 overflow-y-auto')}>
        {divList}
      </div>
    );
  } else if (collMap.size > 0) {
    const divList: ReactNode[] = [];
    let index = 0;
    collMap.forEach((collArray) => {
      const first = collArray[0];
      const collId = getCollectionKeyId(first);

      for (const t of collArray) {
        divList.push(<AstraCollectionCartItem key={collId} collection={t} index={index++} onRemove={onCollsRemove} />);
      }

      divList.push(<div key={Math.random()} className="h-1" />);
    });

    // min-w-0 is important. otherwise text doesn't truncate
    listComponent = (
      <div className={twMerge(textClr, 'min-w-0 flex px-6 flex-col space-y-2 items-start flex-1 overflow-y-auto')}>
        {divList}
      </div>
    );
  } else if (ordersMap.size > 0) {
    const divList: ReactNode[] = [];
    let index = 0;
    ordersMap.forEach((ordArray) => {
      const first = ordArray[0];
      const orderId = first.id;

      divList.push(
        <div className="w-full rounded-md font-bold truncate" key={`header-${first.id}`}>
          {first.nfts.length > 1 ? 'Multiple Collections' : first.nfts[0].collectionName}
        </div>
      );

      for (const t of ordArray) {
        divList.push(<AstraCancelCartItem key={orderId} order={t} index={index++} onRemove={onOrdersRemove} />);
      }

      divList.push(<div key={Math.random()} className="h-1" />);
    });

    // min-w-0 is important. otherwise text doesn't truncate
    listComponent = (
      <div className={twMerge(textClr, 'min-w-0 flex px-6 flex-col space-y-2 items-start flex-1 overflow-y-auto')}>
        {divList}
      </div>
    );
  } else {
    listComponent = (
      <div key={Math.random()} className={twMerge(textClr, 'flex items-center justify-center   uppercase flex-1')}>
        <div>Cart empty</div>
      </div>
    );
  }

  const finalSendToAddress = async (addr: string) => {
    let finalAddress: string | null = addr;
    if (addr.endsWith('.eth')) {
      const provider = getEthersProvider();
      finalAddress = (await provider?.resolveName(addr)) ?? '';
    }
    if (finalAddress) {
      return getAddress(finalAddress);
    }
    return '';
  };

  return (
    // setting to  w-72 so it doen't shrink and expand while animating
    <div className={twMerge(infoBoxBGClr, 'h-full flex flex-col w-72')}>
      <div className=" m-4 flex items-center">
        <div className={twMerge(textClr, 'text-4xl lg:text-3xl font-bold mr-3')}>Cart</div>
        {clearButton}
      </div>

      {cartType === CART_TYPE.SEND && tokenMap.size > 0 && (
        <div className="p-8">
          <TextInputBox
            type="text"
            value={sendToAddress}
            placeholder=""
            label={'Address or ENS'}
            onChange={(value) => setSendToAddress(value)}
          />
        </div>
      )}

      {listComponent}

      <div className="m-6 flex flex-col">
        <AButton
          primary={true}
          disabled={
            !user || chainId !== '1' || (tokens.length === 0 && collections.length === 0 && orders.length === 0)
          }
          onClick={async () => {
            cartType === CART_TYPE.SEND ? onTokenSend(await finalSendToAddress(sendToAddress)) : onCheckout();
          }}
        >
          {checkoutBtnText}
        </AButton>
      </div>
    </div>
  );
};

// ====================================================================

interface Props2 {
  token: Erc721TokenOffer;
  index: number;
  onRemove: (token: Erc721TokenOffer) => void;
}

export const AstraTokenCartItem = ({ token, onRemove }: Props2) => {
  return (
    <div key={getTokenKeyId(token)} className="flex items-center w-full">
      <EZImage className={twMerge('h-12 w-12 rounded-lg overflow-clip')} src={token.image} />

      <div className="ml-3 flex flex-col w-full">
        <div className="leading-5 text-lg font-bold">{token.tokenId}</div>
        <PriceAndExpiry token={token}></PriceAndExpiry>
      </div>

      <Spacer />
      <ARoundButton
        onClick={() => {
          onRemove(token);
        }}
      >
        <MdClose className={twMerge(smallIconButtonStyle, '   ')} />
      </ARoundButton>
    </div>
  );
};

export const AstraSendCartItem = ({ token, onRemove }: Props2) => {
  return (
    <div key={getTokenKeyId(token)} className="flex items-center w-full">
      <EZImage className={twMerge('h-12 w-12 rounded-lg overflow-clip')} src={token.image} />

      <div className="ml-3 flex flex-col w-full">
        <div className="leading-5 text-lg font-bold">{token.tokenId}</div>
      </div>

      <Spacer />
      <ARoundButton
        onClick={() => {
          onRemove(token);
        }}
      >
        <MdClose className={twMerge(smallIconButtonStyle, '   ')} />
      </ARoundButton>
    </div>
  );
};

interface Props3 {
  collection: Erc721CollectionOffer;
  index: number;
  onRemove: (coll: Erc721CollectionOffer) => void;
}

export const AstraCollectionCartItem = ({ collection, onRemove }: Props3) => {
  return (
    <div key={getCollectionKeyId(collection)} className="flex items-center w-full">
      <EZImage className={twMerge('h-12 w-12 rounded-lg overflow-clip')} src={collection.metadata.profileImage} />

      <div className="ml-3 flex flex-col w-full">
        <div className="leading-5 text-gray-500">{collection.metadata.name}</div>
        <PriceAndExpiry collection={collection}></PriceAndExpiry>
      </div>

      <Spacer />
      <ARoundButton
        onClick={() => {
          onRemove(collection);
        }}
      >
        <MdClose className={twMerge(smallIconButtonStyle, '   ')} />
      </ARoundButton>
    </div>
  );
};

interface Props4 {
  order: SignedOBOrder;
  index: number;
  onRemove: (order: SignedOBOrder) => void;
}

export const AstraCancelCartItem = ({ order, onRemove }: Props4) => {
  return (
    <div key={order.id} className="flex items-center w-full">
      <EZImage
        className={twMerge('h-12 w-12 rounded-lg overflow-clip')}
        src={order.nfts[0].tokens[0].tokenImage ?? order.nfts[0].collectionImage}
      />

      <div className="ml-3 flex flex-col w-full">
        <div className="leading-5 text-gray-500">
          {order.nfts.length > 1
            ? 'Multiple tokens'
            : order.nfts[0].tokens.length > 1
            ? 'Multiple tokens'
            : order.nfts[0].tokens[0].tokenId}
        </div>
      </div>

      <Spacer />
      <ARoundButton
        onClick={() => {
          onRemove(order);
        }}
      >
        <MdClose className={twMerge(smallIconButtonStyle, '   ')} />
      </ARoundButton>
    </div>
  );
};

interface Props5 {
  token?: Erc721TokenOffer;
  collection?: Erc721CollectionOffer;
}

const PriceAndExpiry = ({ token, collection }: Props5) => {
  const [price, setPrice] = useState('');
  const [expiry, setExpiry] = useState(getDefaultOrderExpiryTime());
  return (
    <div className="flex flex-row space-x-4">
      <TextInputBox
        autoFocus={true}
        addEthSymbol={true}
        type="number"
        value={price}
        label="Price"
        placeholder="0"
        onChange={(value) => {
          setPrice(value);
          if (token) {
            token.offerPriceEth = parseFloat(value);
          } else if (collection) {
            collection.offerPriceEth = parseFloat(value);
          }
        }}
      />
      <div>
        <div className="text-md mb-2">Expiry</div>
        <ADropdown
          hasBorder={true}
          label={expiry}
          items={[
            {
              label: ORDER_EXPIRY_TIME.HOUR,
              onClick: () => {
                setExpiry(ORDER_EXPIRY_TIME.HOUR);
                if (token) {
                  token.offerExpiry = ORDER_EXPIRY_TIME.HOUR;
                } else if (collection) {
                  collection.offerExpiry = ORDER_EXPIRY_TIME.HOUR;
                }
              }
            },
            {
              label: ORDER_EXPIRY_TIME.DAY,
              onClick: () => {
                setExpiry(ORDER_EXPIRY_TIME.DAY);
                if (token) {
                  token.offerExpiry = ORDER_EXPIRY_TIME.DAY;
                } else if (collection) {
                  collection.offerExpiry = ORDER_EXPIRY_TIME.DAY;
                }
              }
            },
            {
              label: ORDER_EXPIRY_TIME.WEEK,
              onClick: () => {
                setExpiry(ORDER_EXPIRY_TIME.WEEK);
                if (token) {
                  token.offerExpiry = ORDER_EXPIRY_TIME.WEEK;
                } else if (collection) {
                  collection.offerExpiry = ORDER_EXPIRY_TIME.WEEK;
                }
              }
            },
            {
              label: ORDER_EXPIRY_TIME.MONTH,
              onClick: () => {
                setExpiry(ORDER_EXPIRY_TIME.MONTH);
                if (token) {
                  token.offerExpiry = ORDER_EXPIRY_TIME.MONTH;
                } else if (collection) {
                  collection.offerExpiry = ORDER_EXPIRY_TIME.MONTH;
                }
              }
            },
            {
              label: ORDER_EXPIRY_TIME.YEAR,
              onClick: () => {
                setExpiry(ORDER_EXPIRY_TIME.YEAR);
                if (token) {
                  token.offerExpiry = ORDER_EXPIRY_TIME.YEAR;
                } else if (collection) {
                  collection.offerExpiry = ORDER_EXPIRY_TIME.YEAR;
                }
              }
            }
          ]}
        />
      </div>
    </div>
  );
};
