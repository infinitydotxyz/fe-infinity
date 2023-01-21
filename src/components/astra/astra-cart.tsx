import { getAddress } from '@ethersproject/address';
import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { AButton } from 'src/components/astra/astra-button';
import { EZImage, TextInputBox } from 'src/components/common';
import { getCartType, getCollectionKeyId, getDefaultOrderExpiryTime, getTokenCartItemKey } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartItem, CartType, useCartContext } from 'src/utils/context/CartContext';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';
import { ERC721CollectionCartItem, ERC721OrderCartItem, ERC721TokenCartItem, ORDER_EXPIRY_TIME } from 'src/utils/types';
import {
  borderColor,
  brandTextColor,
  extraSmallIconButtonStyle,
  inverseBgColor,
  inverseTextColor,
  secondaryBgColor,
  secondaryTextColor,
  textColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ADropdown } from './astra-dropdown';

interface Props {
  onTokensClear: () => void;
  onCollsClear: () => void;
  onOrdersClear: () => void;
  onCollRemove: (coll: ERC721CollectionCartItem) => void;
  onTokenRemove: (token: ERC721TokenCartItem) => void;
  onOrderRemove: (order: ERC721OrderCartItem) => void;
  onCheckout: () => void;
  onTokenSend: (toAddress: string) => void;
}

export const AstraCart = ({
  onTokensClear,
  onCollsClear,
  onOrdersClear,
  onTokenRemove,
  onCollRemove,
  onOrderRemove,
  onCheckout,
  onTokenSend
}: Props) => {
  const router = useRouter();
  const { selectedProfileTab } = useAppContext();
  const [cartTitle, setCartTitle] = useState('Cart');
  const [checkoutBtnText, setCheckoutBtnText] = useState('Checkout');
  const [sendToAddress, setSendToAddress] = useState('');
  const { user, getEthersProvider, chainId } = useOnboardContext();
  const { cartType, setCartType, getCurrentCartItems, cartItems } = useCartContext();
  const [currentCartItems, setCurrentCartItems] = useState<CartItem[]>([]);

  const [tokenMap, setTokenMap] = useState<Map<string, ERC721TokenCartItem[]>>(new Map());
  const [collMap, setCollMap] = useState<Map<string, ERC721CollectionCartItem[]>>(new Map());
  const [orderMap, setOrderMap] = useState<Map<string, ERC721OrderCartItem[]>>(new Map());

  useEffect(() => {
    const cartType = getCartType(router.asPath, selectedProfileTab);
    setCartType(cartType);
  }, [router.pathname, selectedProfileTab]);

  useEffect(() => {
    const cartItems: CartItem[] = getCurrentCartItems();
    setCurrentCartItems(cartItems);
    if (cartType === CartType.TokenList || cartType === CartType.TokenOffer || cartType === CartType.Send) {
      tokenMap.clear();
      for (const item of cartItems) {
        const token = item as ERC721TokenCartItem;
        const tkns = tokenMap.get(token.tokenAddress ?? '') ?? [];
        tkns.push(token);
        tokenMap.set(token.tokenAddress ?? '', tkns);
      }
      setTokenMap(tokenMap);
    }

    if (cartType === CartType.CollectionOffer) {
      collMap.clear();
      for (const item of cartItems) {
        const coll = item as ERC721CollectionCartItem;
        const colls = collMap.get(coll.address ?? '') ?? [];
        colls.push(coll);
        collMap.set(coll.address ?? '', colls);
      }
      setCollMap(collMap);
    }

    if (cartType === CartType.Cancel) {
      orderMap.clear();
      for (const item of cartItems) {
        const order = item as ERC721OrderCartItem;
        const orders = orderMap.get(order.id ?? '') ?? [];
        orders.push(order);
        orderMap.set(order.id ?? '', orders);
      }
      setOrderMap(orderMap);
    }

    if (cartType === CartType.TokenList) {
      setCartTitle('Sell');
      if (cartItems.length > 1) {
        setCheckoutBtnText('Bulk Sell');
      } else {
        setCheckoutBtnText('Sell');
      }
    } else if (cartType === CartType.CollectionOffer || cartType === CartType.TokenOffer) {
      setCartTitle('Buy');
      if (cartItems.length > 1) {
        setCheckoutBtnText('Bulk Buy');
      } else {
        setCheckoutBtnText('Buy');
      }
    } else if (cartType === CartType.Send) {
      setCartTitle('Send');
      if (cartItems.length > 1) {
        setCheckoutBtnText('Bulk Send');
      } else {
        setCheckoutBtnText('Send');
      }
    } else if (cartType === CartType.Cancel) {
      setCartTitle('Cancel');
      if (cartItems.length > 1) {
        setCheckoutBtnText('Cancel Orders');
      } else {
        setCheckoutBtnText('Cancel Order');
      }
    }
  }, [cartType, cartItems]);

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
    <div className={twMerge('h-full flex flex-col border-l-[1px]', borderColor)}>
      <div className=" m-4 flex items-center">
        <div className={twMerge(textColor, 'text-3xl lg:text-2xl font-bold font-heading mr-3')}>{cartTitle}</div>

        <div className="flex items-center">
          {currentCartItems.length > 0 && (
            <>
              <div className={twMerge(secondaryBgColor, textColor, 'rounded-full h-6 w-6 text-center mr-1')}>
                {currentCartItems.length}
              </div>
              <div
                className={twMerge('ml-2 text-sm cursor-pointer', brandTextColor)}
                onClick={() => {
                  if (
                    cartType === CartType.Send ||
                    cartType === CartType.TokenList ||
                    cartType === CartType.TokenOffer
                  ) {
                    onTokensClear();
                  } else if (cartType === CartType.CollectionOffer) {
                    onCollsClear();
                  } else if (cartType === CartType.Cancel) {
                    onOrdersClear();
                  }
                }}
              >
                Clear
              </div>
            </>
          )}
        </div>
      </div>

      {cartType === CartType.Send && tokenMap.size > 0 && (
        <div className="px-4 mb-4">
          <TextInputBox
            type="text"
            value={sendToAddress}
            placeholder="Address or ENS"
            onChange={(value) => setSendToAddress(value)}
          />
        </div>
      )}

      <div className={twMerge(textColor, 'min-w-0 flex px-6 flex-col space-y-2 items-start flex-1 overflow-y-auto')}>
        {tokenMap.forEach((tokenArray) => {
          <div className="w-full font-bold font-heading truncate" key={`header-${tokenArray[0].id}`}>
            {tokenArray[0].collectionName}
          </div>;

          {
            tokenArray.map((token) =>
              cartType === CartType.Send ? (
                <AstraTokenCartItem
                  key={getTokenCartItemKey(token)}
                  token={token}
                  onRemove={onTokenRemove}
                  showPriceAndExpiry={false}
                />
              ) : (
                <AstraTokenCartItem
                  key={getTokenCartItemKey(token)}
                  token={token}
                  onRemove={onTokenRemove}
                  showPriceAndExpiry={true}
                />
              )
            );
          }

          <div key={Math.random()} className={twMerge('h-2 w-full border-b-[1px]', borderColor)} />;
        })}
        {cartType === CartType.Send || cartType === CartType.TokenList || cartType === CartType.TokenOffer ? (
          tokenMap.forEach((tokenArray) => {
            <div className="w-full font-bold font-heading truncate" key={`header-${tokenArray[0].id}`}>
              {tokenArray[0].collectionName}
            </div>;

            {
              tokenArray.map((token) =>
                cartType === CartType.Send ? (
                  <AstraTokenCartItem
                    key={getTokenCartItemKey(token)}
                    token={token}
                    onRemove={onTokenRemove}
                    showPriceAndExpiry={false}
                  />
                ) : (
                  <AstraTokenCartItem
                    key={getTokenCartItemKey(token)}
                    token={token}
                    onRemove={onTokenRemove}
                    showPriceAndExpiry={true}
                  />
                )
              );
            }

            <div key={Math.random()} className={twMerge('h-2 w-full border-b-[1px]', borderColor)} />;
          })
        ) : cartType === CartType.CollectionOffer ? (
          collMap.forEach((collArray) => {
            {
              collArray.forEach((coll) => (
                <AstraCollectionCartItem key={getCollectionKeyId(coll)} collection={coll} onRemove={onCollRemove} />
              ));
            }

            <div key={Math.random()} className={twMerge('h-2 w-full border-b-[1px]', borderColor)} />;
          })
        ) : cartType === CartType.Cancel ? (
          orderMap.forEach((ordArray) => {
            <div className="w-full rounded-md truncate" key={`header-${ordArray[0].id}`}>
              {ordArray[0].nfts.length > 1 ? 'Multiple Collections' : ordArray[0].nfts[0].collectionName}
            </div>;

            {
              ordArray.forEach((order) => (
                <AstraCancelCartItem key={order.id} order={order} onRemove={onOrderRemove} />
              ));
            }

            <div key={Math.random()} className={twMerge('h-2 w-full border-b-[1px]', borderColor)} />;
          })
        ) : (
          <div key={Math.random()} className={twMerge(textColor, 'flex items-center justify-center uppercase flex-1')}>
            <div className={twMerge('font-medium font-heading', secondaryTextColor)}>Cart empty</div>
          </div>
        )}
      </div>

      {/* todo: change the chainId check here when more chains are supported */}
      <div className="m-6 flex flex-col">
        <AButton
          className="p-3"
          primary={true}
          disabled={
            !user ||
            chainId !== ChainId.Mainnet ||
            currentCartItems.length === 0 ||
            (cartType === CartType.Send && !sendToAddress)
          }
          onClick={async () => {
            cartType === CartType.Send ? onTokenSend(await finalSendToAddress(sendToAddress)) : onCheckout();
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
  token: ERC721TokenCartItem;
  onRemove: (token: ERC721TokenCartItem) => void;
  showPriceAndExpiry?: boolean;
}

const AstraTokenCartItem = ({ token, onRemove, showPriceAndExpiry }: Props2) => {
  return (
    <div key={getTokenCartItemKey(token)} className="flex items-center w-full">
      <div className="relative">
        <EZImage className={twMerge('h-12 w-12 rounded-lg overflow-clip')} src={token.image} />
        <div className={twMerge('absolute top-[-5px] right-[-5px] rounded-full p-0.5 cursor-pointer', inverseBgColor)}>
          <MdClose
            className={twMerge(extraSmallIconButtonStyle, inverseTextColor)}
            onClick={() => {
              onRemove(token);
            }}
          />
        </div>
      </div>

      <div className="ml-3 flex w-full space-x-2 items-center">
        <div className="font-bold font-heading w-1/3 text-sm">{token.tokenId}</div>
        {showPriceAndExpiry && <PriceAndExpiry token={token} className=""></PriceAndExpiry>}
      </div>
    </div>
  );
};

interface Props3 {
  collection: ERC721CollectionCartItem;
  onRemove: (coll: ERC721CollectionCartItem) => void;
}

const AstraCollectionCartItem = ({ collection, onRemove }: Props3) => {
  return (
    <div key={getCollectionKeyId(collection)} className="flex items-center w-full">
      <div className="relative">
        <EZImage className={twMerge('h-12 w-12 rounded-lg overflow-clip')} src={collection.metadata.profileImage} />
        <div className={twMerge('absolute top-[-5px] right-[-5px] rounded-full p-0.5 cursor-pointer', inverseBgColor)}>
          <MdClose
            className={twMerge(extraSmallIconButtonStyle, inverseTextColor)}
            onClick={() => {
              onRemove(collection);
            }}
          />
        </div>
      </div>

      <div className="ml-4 flex w-full flex-col space-y-2">
        <div className={twMerge('font-bold font-heading text-sm truncate')}>{collection.metadata.name}</div>
        <PriceAndExpiry collection={collection}></PriceAndExpiry>
      </div>
    </div>
  );
};

interface Props4 {
  order: ERC721OrderCartItem;
  onRemove: (order: ERC721OrderCartItem) => void;
}

const AstraCancelCartItem = ({ order, onRemove }: Props4) => {
  return (
    <div key={order.id} className="flex items-center w-full">
      <div className="relative">
        <EZImage
          className={twMerge('h-12 w-12 rounded-lg overflow-clip')}
          src={order.nfts[0].tokens[0].tokenImage ?? order.nfts[0].collectionImage}
        />
        <div className={twMerge('absolute top-[-5px] right-[-5px] rounded-full p-0.5 cursor-pointer', inverseBgColor)}>
          <MdClose
            className={twMerge(extraSmallIconButtonStyle, inverseTextColor)}
            onClick={() => {
              onRemove(order);
            }}
          />
        </div>
      </div>

      <div className="ml-3 flex flex-col w-full">
        <div className={twMerge(secondaryTextColor)}>
          {order.nfts.length > 1
            ? 'Multiple tokens'
            : order.nfts[0].tokens.length > 1
            ? 'Multiple tokens'
            : order.nfts[0].tokens[0].tokenId}
        </div>
      </div>
    </div>
  );
};

interface Props5 {
  token?: ERC721TokenCartItem;
  collection?: ERC721CollectionCartItem;
  className?: string;
}

const PriceAndExpiry = ({ token, collection, className }: Props5) => {
  const [price, setPrice] = useState('');
  const [expiry, setExpiry] = useState(getDefaultOrderExpiryTime());
  return (
    <div className={twMerge('flex flex-row space-x-4', className)}>
      <TextInputBox
        autoFocus={true}
        addEthSymbol={true}
        type="number"
        value={price}
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
