import { getAddress } from '@ethersproject/address';
import { PROTOCOL_FEE_BPS } from '@infinityxyz/lib-frontend/utils';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import { AButton } from 'src/components/astra/astra-button';
import { EZImage, EthSymbol, Spacer, TextInputBox, ToggleTab } from 'src/components/common';
import {
  FEE_BPS,
  FLOW_TOKEN,
  ROYALTY_BPS,
  WNative,
  ellipsisString,
  getCartType,
  getCollectionKeyId,
  getDefaultOrderExpiryTime,
  getTokenCartItemKey,
  nFormatter
} from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartItem, CartType, useCartContext } from 'src/utils/context/CartContext';
import { fetchMinXflBalanceForZeroFee } from 'src/utils/orderbook-utils';
import { ERC721CollectionCartItem, ERC721OrderCartItem, ERC721TokenCartItem, ORDER_EXPIRY_TIME } from 'src/utils/types';
import {
  borderColor,
  brandTextColor,
  extraSmallIconButtonStyle,
  inverseBgColor,
  inverseTextColor,
  secondaryBgColor,
  secondaryBtnBgColorText,
  secondaryTextColor,
  smallIconButtonStyle,
  textColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useAccount, useBalance, useNetwork, useProvider } from 'wagmi';
import { UniswapModal } from '../common/uniswap-model';
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

const getTokenFinalPrice = (token: ERC721TokenCartItem, cartType: CartType): number => {
  const price = token?.price
    ? token?.price.toString()
    : token?.orderSnippet?.listing?.orderItem?.startPriceEth
    ? token?.orderSnippet?.listing?.orderItem?.startPriceEth.toString()
    : '0';
  const gasCostEth = token?.orderSnippet?.listing?.orderItem?.gasCostEth ?? 0;
  const feeCostEth = token?.orderSnippet?.listing?.orderItem?.feeCostEth ?? 0;

  const priceWei = parseEther(price.toString());
  const calcFeesWei = priceWei.mul(PROTOCOL_FEE_BPS).div(10_000);
  const calcFeeCostEth = parseFloat(formatEther(calcFeesWei));
  const finalFeeCostEth = Math.min(calcFeeCostEth, feeCostEth);

  let deltaPrice = gasCostEth + finalFeeCostEth;
  if (cartType === CartType.TokenBuy) {
    deltaPrice = 0;
  }

  const finalPrice = token?.orderPriceEth ? token?.orderPriceEth : price ? parseFloat(price) + deltaPrice : 0;
  return finalPrice;
};

export const AstraCart = ({
  onTokensClear,
  onCollsClear,
  onOrdersClear,
  onTokenRemove,
  onCollRemove,
  onCheckout,
  onTokenSend
}: Props) => {
  const router = useRouter();
  const { selectedProfileTab, selectedCollectionTab, isCheckingOut, setIsCheckingOut, checkoutBtnStatus } =
    useAppContext();
  const [cartTitle, setCartTitle] = useState('Cart');
  const [checkoutBtnText, setCheckoutBtnText] = useState('Checkout');
  const [sendToAddress, setSendToAddress] = useState('');

  const [uniswapTokenInfo, setUniswapTokenInfo] = useState({
    title: `Buy ${FLOW_TOKEN.symbol}`,
    name: FLOW_TOKEN.name,
    symbol: FLOW_TOKEN.symbol,
    address: FLOW_TOKEN.address,
    decimals: FLOW_TOKEN.decimals,
    logoURI: 'https://assets.coingecko.com/coins/images/30617/small/flowLogoSquare.png'
  });
  const [showBuyTokensModal, setShowBuyTokensModal] = useState(false);

  const provider = useProvider();
  const { address: user } = useAccount();
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id);

  const { cartType, setCartType, getCurrentCartItems, cartItems } = useCartContext();
  const [currentCartItems, setCurrentCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [fees, setFees] = useState(0);
  const [royalties, setRoyalties] = useState(0);
  const [netProceeds, setNetProceeds] = useState(0);

  const setTokenInfo = (token: string) => {
    switch (token) {
      case 'WETH': {
        const address = WNative[parseInt(selectedChain, 10)];
        if (!address) {
          throw new Error(`Unsupported chainId`);
        }
        setUniswapTokenInfo({
          title: 'Wrap ETH',
          name: 'WETH',
          symbol: 'WETH',
          address: address,
          decimals: 18,
          logoURI:
            'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
        });
        break;
      }
      default:
        setUniswapTokenInfo({
          title: `Buy ${FLOW_TOKEN.symbol}`,
          name: FLOW_TOKEN.name,
          symbol: FLOW_TOKEN.symbol,
          address: FLOW_TOKEN.address,
          decimals: FLOW_TOKEN.decimals,
          logoURI: 'https://assets.coingecko.com/coins/images/30617/small/flowLogoSquare.png'
        });
    }
  };

  const xflBalanceObj = useBalance({
    address: user,
    token: FLOW_TOKEN.address as `0x${string}`,
    watch: false,
    cacheTime: 5_000,
    chainId: 1
  });
  const xflBalance = parseFloat(xflBalanceObj?.data?.formatted ?? '0');

  const blurBalanceObj = useBalance({
    address: user,
    token: '0x5283d291dbcf85356a21ba090e6db59121208b44' as `0x${string}`,
    watch: false,
    cacheTime: 5_000,
    chainId: 1
  });
  const blurBalance = parseFloat(blurBalanceObj?.data?.formatted ?? '0');

  const looksBalanceObj = useBalance({
    address: user,
    token: '0xf4d2888d29d722226fafa5d9b24f9164c092421e' as `0x${string}`,
    watch: false,
    cacheTime: 5_000,
    chainId: 1
  });
  const looksBalance = parseFloat(looksBalanceObj?.data?.formatted ?? '0');

  const x2y2BalanceObj = useBalance({
    address: user,
    token: '0x1e4ede388cbc9f4b5c79681b7f94d36a11abebc9' as `0x${string}`,
    watch: false,
    cacheTime: 5_000,
    chainId: 1
  });
  const x2y2Balance = parseFloat(x2y2BalanceObj?.data?.formatted ?? '0');

  const sudoBalanceObj = useBalance({
    address: user,
    token: '0x3446dd70b2d52a6bf4a5a192d9b0a161295ab7f9' as `0x${string}`,
    watch: false,
    cacheTime: 5_000,
    chainId: 1
  });
  const sudoBalance = parseFloat(sudoBalanceObj?.data?.formatted ?? '0');

  const [minBalForFeeWaiverAndBoost, setMinBalForFeeWaiverAndBoost] = useState(0);
  const [holderOfToken, setHolderOfToken] = useState('');
  // const [xflStakeBoost, setXflStakeBoost] = useState('0x');
  const [areFeesWaived, setAreFeesWaived] = useState(false);

  const [tokenMap, setTokenMap] = useState<Map<string, ERC721TokenCartItem[]>>(new Map());
  const [collMap, setCollMap] = useState<Map<string, ERC721CollectionCartItem[]>>(new Map());
  const [orderMap, setOrderMap] = useState<Map<string, ERC721TokenCartItem[]>>(new Map());

  const [cartTabOptions] = useState(['Totals']);
  const [selectedTab, setSelectedTab] = useState(cartTabOptions[0]);

  useEffect(() => {
    const feeBps = areFeesWaived ? 0 : FEE_BPS;
    const royaltyBps = areFeesWaived ? 0 : ROYALTY_BPS;
    const newFees = (cartTotal * feeBps) / 10_000;
    const newRoyalties = (cartTotal * royaltyBps) / 10_000;
    const newNetProceeds = cartTotal - newFees - newRoyalties;

    setFees(newFees);
    setRoyalties(newRoyalties);
    setNetProceeds(newNetProceeds);
  }, [cartTotal]);

  useEffect(() => {
    getMinBalanceInfo();
  });

  const getMinBalanceInfo = async () => {
    const minBal = minBalForFeeWaiverAndBoost === 0 ? await fetchMinXflBalanceForZeroFee() : minBalForFeeWaiverAndBoost;
    setMinBalForFeeWaiverAndBoost(minBal);

    // const boost = xflStaked >= minStakeAmount ? 2 : 0;
    // setXflStakeBoost(boost + 'x');

    const feesWaived =
      xflBalance >= minBal ||
      blurBalance >= minBal ||
      looksBalance >= minBal ||
      x2y2Balance >= minBal ||
      sudoBalance >= minBal;
    setAreFeesWaived(feesWaived);

    const holder =
      xflBalance >= minBal
        ? FLOW_TOKEN.symbol
        : blurBalance >= minBal
        ? 'BLUR'
        : looksBalance >= minBal
        ? 'LOOKS'
        : x2y2Balance >= minBal
        ? 'X2Y2'
        : sudoBalance >= minBal
        ? 'SUDO'
        : '';
    setHolderOfToken(holder);
  };

  const currency = WNative[parseInt(selectedChain, 10)];
  if (!currency) {
    throw new Error(`Unsupported network`);
  }

  const { data: wethBalance, isLoading } = useBalance({
    address: user,
    token: currency as `0x{string}`,
    watch: false
  });

  const { data: ethBalance, isLoading: isEthBalanceLoading } = useBalance({
    address: user,
    watch: false
  });

  let cartItemList: ReactNode;
  const [cartContent, setCartContent] = useState<ReactNode>(cartItemList);

  const onCartTabOptionsChange = (value: string) => {
    switch (value) {
      case 'Totals':
        setSelectedTab('Totals');
        break;
      case 'Options':
        setSelectedTab('Options');
        break;
    }
  };

  const finalSendToAddress = async (addr: string) => {
    let finalAddress: string | null = addr;
    if (addr.endsWith('.eth')) {
      finalAddress = (await provider?.resolveName(addr)) ?? '';
    }
    if (finalAddress) {
      return getAddress(finalAddress);
    }
    return '';
  };

  const upateCartItemList = () => {
    let newCartTotal = 0;
    if (
      (cartType === CartType.TokenList ||
        cartType === CartType.TokenBid ||
        cartType === CartType.TokenBuy ||
        cartType === CartType.AcceptOffer ||
        cartType === CartType.Send) &&
      tokenMap.size > 0
    ) {
      const divList: ReactNode[] = [];
      tokenMap.forEach((tokenArray) => {
        const first = tokenArray[0];

        divList.push(
          <div
            className={twMerge(
              'w-full font-bold font-heading truncate',
              cartType === CartType.TokenList ? 'min-h-[25px]' : 'min-h-[25px]'
            )}
            key={`header-${first.id}`}
          >
            {first.collectionName}
          </div>
        );

        for (const t of tokenArray) {
          if (cartType !== CartType.Send) {
            const price = getTokenFinalPrice(t, cartType);
            newCartTotal += price;
          }
          divList.push(
            <AstraTokenCartItem
              key={getTokenCartItemKey(t)}
              token={t}
              onRemove={onTokenRemove}
              updateCartTotal={(newVal: string, oldVal: string) => {
                newCartTotal += Number(newVal) - Number(oldVal);
                setCartTotal(newCartTotal);
              }}
            />
          );
        }
        divList.push(<div key={Math.random()} className={twMerge('h-2 w-full border-b-[1px]', borderColor)} />);
      });

      // min-w-0 is important otherwise text doesn't truncate
      cartItemList = (
        <div className={twMerge(textColor, 'min-w-0 flex px-4 flex-col space-y-2 items-start flex-1 overflow-y-auto')}>
          {divList}
        </div>
      );
    } else if (cartType === CartType.CollectionBid && collMap.size > 0) {
      const divList: ReactNode[] = [];
      collMap.forEach((collArray) => {
        for (const t of collArray) {
          newCartTotal += t.offerPriceEth ?? 0;
          divList.push(
            <AstraCollectionCartItem
              key={getCollectionKeyId(t)}
              collection={t}
              onRemove={onCollRemove}
              updateCartTotal={(newVal: string, oldVal: string) => {
                newCartTotal += Number(newVal) - Number(oldVal);
                setCartTotal(newCartTotal);
              }}
            />
          );
        }

        divList.push(<div key={Math.random()} className={twMerge('h-2 w-full border-b-[1px]', borderColor)} />);
      });

      // min-w-0 is important otherwise text doesn't truncate
      cartItemList = (
        <div className={twMerge(textColor, 'min-w-0 flex px-4 flex-col space-y-2 items-start flex-1 overflow-y-auto')}>
          {divList}
        </div>
      );
    } else if (cartType === CartType.Cancel && orderMap.size > 0) {
      const divList: ReactNode[] = [];
      orderMap.forEach((ordArray) => {
        const first = ordArray[0];
        const orderId = first.id;
        const isCollBid = first.criteria?.kind === 'collection';
        const firstCollName = isCollBid ? first.criteria?.data?.collection?.name : first.collectionName;

        divList.push(
          <div className="w-full rounded-md truncate font-bold font-heading min-h-[25px]" key={`header-${orderId}`}>
            {firstCollName}
          </div>
        );

        for (const t of ordArray) {
          divList.push(
            isCollBid ? (
              <AstraCancelCartItem key={t.id} order={t} onCollectionRemove={onCollRemove} />
            ) : (
              <AstraCancelCartItem key={t.id} order={t} onTokenRemove={onTokenRemove} />
            )
          );
        }

        divList.push(<div key={Math.random()} className={twMerge('h-2 w-full border-b-[1px]', borderColor)} />);
      });

      // min-w-0 is important otherwise text doesn't truncate
      cartItemList = (
        <div className={twMerge(textColor, 'min-w-0 flex px-4 flex-col space-y-2 items-start flex-1 overflow-y-auto')}>
          {divList}
        </div>
      );
    } else {
      cartItemList = (
        <div key={Math.random()} className={twMerge(textColor, 'flex items-center justify-center uppercase flex-1')}>
          <div className={twMerge('font-medium font-body', secondaryTextColor)}>Cart empty</div>
        </div>
      );
    }

    setCartTotal(newCartTotal);
  };

  useEffect(() => {
    const cartType = getCartType(router.asPath, selectedProfileTab, selectedCollectionTab);
    setCartType(cartType);
  }, [router.pathname, selectedProfileTab, selectedCollectionTab]);

  useEffect(() => {
    const cartItems: CartItem[] = getCurrentCartItems();
    setCurrentCartItems(cartItems);

    if (
      cartType === CartType.TokenList ||
      cartType === CartType.TokenBid ||
      cartType === CartType.TokenBuy ||
      cartType === CartType.AcceptOffer ||
      cartType === CartType.Send
    ) {
      tokenMap.clear();
      for (const item of cartItems) {
        const token = item as ERC721TokenCartItem;
        const tkns = tokenMap.get(token.tokenAddress ?? '') ?? [];
        tkns.push(token);
        tokenMap.set(token.tokenAddress ?? '', tkns);
      }
      setTokenMap(tokenMap);
    }

    if (cartType === CartType.CollectionBid) {
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
        const order = item as ERC721TokenCartItem;
        const orders = orderMap.get(order.address ?? '') ?? [];
        orders.push(order);
        orderMap.set(order.address ?? '', orders);
      }
      setOrderMap(orderMap);
    }

    // render cart title and checkout button text
    if (cartType === CartType.TokenList) {
      setCartTitle('List');
      if (cartItems.length > 1) {
        setCheckoutBtnText('Bulk List');
      } else {
        setCheckoutBtnText('List');
      }
    } else if (cartType === CartType.CollectionBid) {
      if (cartItems.length > 1) {
        setCartTitle('Collection Bids');
        setCheckoutBtnText('Bulk Bid');
      } else {
        setCartTitle('Collection Bid');
        setCheckoutBtnText('Bid');
      }
    } else if (cartType === CartType.TokenBid) {
      setCartTitle('Bid');
      if (cartItems.length > 1) {
        setCheckoutBtnText('Bulk Bid');
      } else {
        setCheckoutBtnText('Bid');
      }
    } else if (cartType === CartType.TokenBuy) {
      setCartTitle('Buy');
      setCheckoutBtnText('Buy');
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
    } else if (cartType === CartType.AcceptOffer) {
      setCartTitle('Sell');
      if (cartItems.length > 1) {
        setCheckoutBtnText('Bulk Sell');
      } else {
        setCheckoutBtnText('Sell');
      }
    }

    // render cartItemList
    upateCartItemList();
    setCartContent(cartItemList);
  }, [cartType, cartItems, tokenMap.size, collMap.size, orderMap.size]);

  return (
    <div className={twMerge('h-full flex flex-col border-l-[1px]', borderColor)}>
      <div className="m-4 flex items-center">
        <div className={twMerge(textColor, 'md:text-3xl lg:text-2xl font-bold font-body mr-3')}>{cartTitle}</div>

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
                    cartType === CartType.TokenBid ||
                    cartType === CartType.TokenBuy ||
                    cartType === CartType.AcceptOffer
                  ) {
                    onTokensClear();
                  } else if (cartType === CartType.CollectionBid) {
                    onCollsClear();
                  } else if (cartType === CartType.Cancel) {
                    onOrdersClear();
                    onTokensClear();
                    onCollsClear();
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

      {cartContent}

      {cartType !== CartType.Send && cartType !== CartType.Cancel && (
        <div className={twMerge('m-4 flex flex-col text-sm space-y-2 rounded-lg p-3', secondaryBgColor)}>
          <ToggleTab
            className="mb-2"
            options={cartTabOptions}
            defaultOption={cartTabOptions[0]}
            onChange={onCartTabOptionsChange}
          />

          {selectedTab === 'Totals' && (
            <div className="space-y-3 px-1">
              <div className={twMerge('border-b-[1px] pb-2 space-y-2', borderColor)}>
                <div className={twMerge('flex justify-between')}>
                  <div className={twMerge(secondaryTextColor, 'font-medium')}>Cart total: </div>
                  <div className="font-supply">
                    {nFormatter(Number(cartTotal))} <span className="font-body">{EthSymbol}</span>
                  </div>
                </div>

                {user && cartType === CartType.TokenList && (
                  <div className="text-xs">
                    <div className={twMerge('flex justify-between')}>
                      <div className={twMerge(secondaryTextColor)}>Platform fees: </div>
                      <div className="font-heading">
                        {nFormatter(Number(fees))} {EthSymbol}
                      </div>
                    </div>

                    <div className={twMerge('flex justify-between')}>
                      <div className={twMerge(secondaryTextColor)}>Royalties: </div>
                      <div className="font-heading">
                        {nFormatter(Number(royalties))} {EthSymbol}
                      </div>
                    </div>

                    <div className={twMerge('flex justify-between text-sm mt-2')}>
                      <div className={twMerge(secondaryTextColor, 'font-medium')}>Net proceeds: </div>
                      <div className="font-heading">
                        {nFormatter(Number(netProceeds))} {EthSymbol}
                      </div>
                    </div>

                    <div className={twMerge('mt-4 rounded-md space-y-1 text-xs')}>
                      {/* <div className={twMerge('flex justify-between')}>
                        <div className={twMerge(secondaryTextColor, 'font-medium')}>Staked ${FLOW_TOKEN.symbol}: </div>
                        <div className="font-heading">{nFormatter(Number(xflStaked))}</div>
                      </div> */}

                      {/* <div className={twMerge('flex justify-between')}>
                        <div className={twMerge(secondaryTextColor, 'font-medium')}>Reward boost: </div>
                        <div className="font-heading">{xflStakeBoost}</div>
                      </div> */}

                      <div className={twMerge('flex')}>
                        {areFeesWaived ? (
                          // <div className={twMerge(secondaryTextColor, 'mt-2')}>
                          //   You are maximizing your net proceeds and will earn {xflStakeBoost} rewards. Buyer of your
                          //   listing will save upto 40% on gas fees.
                          // </div>
                          <div className={twMerge(secondaryTextColor, 'mt-2')}>
                            You are maximizing your net proceeds for holding {nFormatter(minBalForFeeWaiverAndBoost)} $
                            {holderOfToken} tokens. Buyers of your{' '}
                            {currentCartItems.length > 1 ? 'listings ' : 'listing '} will save upto 40% on gas fees.
                          </div>
                        ) : (
                          <div className="flex mt-2">
                            <div className={twMerge(secondaryTextColor)}>
                              Pay zero fees & royalties when you hold {nFormatter(minBalForFeeWaiverAndBoost)} or more
                              of any of these tokens: ${FLOW_TOKEN.symbol}, $BLUR, $LOOKS, $X2Y2, $SUDO. If you are a
                              holder, buyers of your {currentCartItems.length > 1 ? 'listings ' : 'listing '}
                              will benefit by saving upto 40% on gas fees. Your
                              {currentCartItems.length > 1 ? ' listings ' : ' listing '} will also be shown first,
                              before other similarly priced listings.
                              <span
                                className={twMerge('underline cursor-pointer ml-[2px]', brandTextColor)}
                                onClick={() => {
                                  setTokenInfo(FLOW_TOKEN.symbol);
                                  setShowBuyTokensModal(true);
                                }}
                              >
                                Buy
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {user &&
                (cartType === CartType.TokenBid ||
                  cartType === CartType.CollectionBid ||
                  cartType === CartType.TokenBuy) && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={twMerge(secondaryTextColor, 'font-medium')}>ETH Balance: </span>
                      {isEthBalanceLoading ? (
                        <span>Loading...</span>
                      ) : (
                        <span className="font-heading">
                          {nFormatter(Number(ethBalance?.formatted))} {EthSymbol}
                        </span>
                      )}
                    </div>

                    {(cartType === CartType.TokenBid || cartType === CartType.CollectionBid) && (
                      <div className="flex justify-between">
                        <span className={twMerge(secondaryTextColor, 'font-medium')}>WETH Balance: </span>

                        <div>
                          {isLoading ? (
                            <span>Loading...</span>
                          ) : (
                            <span className="font-heading">
                              {nFormatter(Number(wethBalance?.formatted))} {EthSymbol}
                            </span>
                          )}
                          <AButton
                            className={twMerge('rounded-md text-xs ml-2', secondaryBtnBgColorText)}
                            onClick={() => {
                              setTokenInfo('WETH');
                              setShowBuyTokensModal(true);
                            }}
                          >
                            Wrap ETH
                          </AButton>
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}

          {/* {selectedTab === 'Options' && (
          <div className="h-60 overflow-y-scroll">
            <div className="space-y-3 px-1">
              <RadioGroup value={executionMode} onChange={setExecutionMode} className="space-y-2">
                <RadioGroup.Label>Execution mode:</RadioGroup.Label>
                <RadioButtonCard
                  value={ExecutionMode.Fast}
                  label="Fast"
                  description="Does not wait to batch with other orders. May cost more gas."
                />
                <RadioButtonCard
                  value={ExecutionMode.Batched}
                  label="Batched"
                  description="Batches with other users' orders. Costs less gas."
                />
              </RadioGroup>
            </div>
          </div>
        )} */}
        </div>
      )}

      <div className="m-6 flex flex-col">
        <AButton
          className="p-3 z-30"
          primary={true}
          disabled={
            isCheckingOut ||
            !user ||
            currentCartItems.length === 0 ||
            (cartType === CartType.Send && !sendToAddress) ||
            chainId !== selectedChain
          }
          onClick={async () => {
            setIsCheckingOut(true);
            cartType === CartType.Send ? onTokenSend(await finalSendToAddress(sendToAddress)) : onCheckout();
          }}
        >
          {isCheckingOut ? <div className="animate-pulse">{checkoutBtnStatus}</div> : checkoutBtnText}
        </AButton>
      </div>

      {showBuyTokensModal && (
        <UniswapModal
          onClose={() => setShowBuyTokensModal(false)}
          title={uniswapTokenInfo.title}
          chainId={Number(chainId)}
          tokenAddress={uniswapTokenInfo.address}
          tokenName={uniswapTokenInfo.name}
          tokenDecimals={uniswapTokenInfo.decimals}
          tokenSymbol={uniswapTokenInfo.symbol}
          tokenLogoURI={uniswapTokenInfo.logoURI}
        />
      )}
    </div>
  );
};

// ====================================================================

interface Props2 {
  token: ERC721TokenCartItem;
  onRemove: (token: ERC721TokenCartItem) => void;
  updateCartTotal: (prevPrice: string, newPrice: string) => void;
}

const AstraTokenCartItem = ({ token, onRemove, updateCartTotal }: Props2) => {
  const { cartType } = useCartContext();

  const finalPrice = getTokenFinalPrice(token, cartType);
  token.orderPriceEth = finalPrice;

  const [editedPrice, setEditedPrice] = useState(finalPrice.toString());
  const [editing, setEditing] = useState(finalPrice ? false : true);

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
        <div className="w-1/3 text-sm">{ellipsisString(token.tokenId)}</div>
        {cartType !== CartType.Send && (
          <PriceAndExpiry
            token={token}
            className=""
            editing={editing}
            onEditComplete={(newValue) => {
              updateCartTotal(newValue, editedPrice);
              setEditedPrice(newValue);
              setEditing(false);
            }}
            useSpacer
            currentPrice={editedPrice}
            hideExpiry={cartType === CartType.TokenBuy || cartType === CartType.AcceptOffer}
          ></PriceAndExpiry>
        )}
        {!editing &&
          cartType !== CartType.Send &&
          cartType !== CartType.TokenBuy &&
          cartType !== CartType.AcceptOffer && (
            <FiEdit3 className={twMerge(smallIconButtonStyle, 'cursor-pointer')} onClick={() => setEditing(true)} />
          )}
      </div>
    </div>
  );
};

interface Props3 {
  collection: ERC721CollectionCartItem;
  onRemove: (coll: ERC721CollectionCartItem) => void;
  updateCartTotal: (prevPrice: string, newPrice: string) => void;
}

const AstraCollectionCartItem = ({ collection, onRemove, updateCartTotal }: Props3) => {
  const [editedPrice, setEditedPrice] = useState(collection.offerPriceEth?.toString());
  const [editing, setEditing] = useState(editedPrice ? false : true);

  return (
    <div key={getCollectionKeyId(collection)} className="flex items-center w-full mt-3">
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
        <div className="flex flex-row items-center">
          <PriceAndExpiry
            collection={collection}
            editing={editing}
            onEditComplete={(newValue) => {
              updateCartTotal(newValue, editedPrice ?? '0');
              setEditedPrice(newValue);
              setEditing(false);
            }}
            currentPrice={editedPrice}
          ></PriceAndExpiry>
          {!editing && (
            <FiEdit3
              className={twMerge(smallIconButtonStyle, 'ml-2 cursor-pointer')}
              onClick={() => setEditing(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface Props4 {
  order: ERC721TokenCartItem | ERC721CollectionCartItem;
  onTokenRemove?: (order: ERC721TokenCartItem) => void;
  onCollectionRemove?: (order: ERC721CollectionCartItem) => void;
}

const AstraCancelCartItem = ({ order, onTokenRemove, onCollectionRemove }: Props4) => {
  const isCollBid = order.criteria?.kind === 'collection';
  const image = isCollBid ? order.criteria?.data?.collection?.image : order.image;
  const tokenId = isCollBid ? '' : (order as ERC721TokenCartItem).tokenId;
  return (
    <div key={order.id} className="flex items-center w-full">
      <div className="relative">
        <EZImage className={twMerge('h-12 w-12 rounded-lg overflow-clip')} src={image} />
        <div className={twMerge('absolute top-[-5px] right-[-5px] rounded-full p-0.5 cursor-pointer', inverseBgColor)}>
          <MdClose
            className={twMerge(extraSmallIconButtonStyle, inverseTextColor)}
            onClick={() => {
              isCollBid
                ? onCollectionRemove?.(order as ERC721CollectionCartItem)
                : onTokenRemove?.(order as ERC721TokenCartItem);
            }}
          />
        </div>
      </div>

      <div className="ml-3 flex flex-col w-full text-sm font-bold font-heading">
        <div>{ellipsisString(tokenId)}</div>
        <PriceAndExpiry
          token={isCollBid ? undefined : (order as ERC721TokenCartItem)}
          collection={isCollBid ? (order as ERC721CollectionCartItem) : undefined}
          className=""
          editing={false}
          useSpacer
          currentPrice={
            isCollBid
              ? (order as ERC721CollectionCartItem).offerPriceEth?.toString()
              : (order as ERC721TokenCartItem).price?.toString()
          }
          hideExpiry={true}
        ></PriceAndExpiry>
      </div>
    </div>
  );
};

interface Props5 {
  token?: ERC721TokenCartItem;
  collection?: ERC721CollectionCartItem;
  className?: string;
  editing?: boolean;
  onEditComplete?: (price: string) => void;
  useSpacer?: boolean;
  currentPrice?: string;
  hideExpiry?: boolean;
}

const PriceAndExpiry = ({
  token,
  collection,
  className,
  editing,
  onEditComplete,
  currentPrice,
  hideExpiry
}: Props5) => {
  const [price, setPrice] = useState(nFormatter(parseFloat(currentPrice ?? '0'), 2)?.toString() ?? '');
  const [expiry, setExpiry] = useState(getDefaultOrderExpiryTime());

  const priceEditable = !currentPrice || editing;

  return (
    <div className={twMerge('flex flex-row space-x-4 w-full', className)}>
      {!priceEditable ? (
        <div className="flex w-full space-x-6">
          {hideExpiry && <Spacer />}
          {!hideExpiry && (
            <ADropdown
              hasBorder={true}
              alignMenuRight={true}
              label={expiry}
              innerClassName="w-24"
              items={[
                {
                  label: ORDER_EXPIRY_TIME.HOUR,
                  onClick: () => {
                    onEditComplete?.(price);
                    setExpiry(ORDER_EXPIRY_TIME.HOUR);
                    if (token) {
                      token.orderExpiry = ORDER_EXPIRY_TIME.HOUR;
                    } else if (collection) {
                      collection.offerExpiry = ORDER_EXPIRY_TIME.HOUR;
                    }
                  }
                },
                {
                  label: ORDER_EXPIRY_TIME.DAY,
                  onClick: () => {
                    onEditComplete?.(price);
                    setExpiry(ORDER_EXPIRY_TIME.DAY);
                    if (token) {
                      token.orderExpiry = ORDER_EXPIRY_TIME.DAY;
                    } else if (collection) {
                      collection.offerExpiry = ORDER_EXPIRY_TIME.DAY;
                    }
                  }
                },
                {
                  label: ORDER_EXPIRY_TIME.WEEK,
                  onClick: () => {
                    onEditComplete?.(price);
                    setExpiry(ORDER_EXPIRY_TIME.WEEK);
                    if (token) {
                      token.orderExpiry = ORDER_EXPIRY_TIME.WEEK;
                    } else if (collection) {
                      collection.offerExpiry = ORDER_EXPIRY_TIME.WEEK;
                    }
                  }
                },
                {
                  label: ORDER_EXPIRY_TIME.MONTH,
                  onClick: () => {
                    onEditComplete?.(price);
                    setExpiry(ORDER_EXPIRY_TIME.MONTH);
                    if (token) {
                      token.orderExpiry = ORDER_EXPIRY_TIME.MONTH;
                    } else if (collection) {
                      collection.offerExpiry = ORDER_EXPIRY_TIME.MONTH;
                    }
                  }
                },
                {
                  label: ORDER_EXPIRY_TIME.SIX_MONTHS,
                  onClick: () => {
                    onEditComplete?.(price);
                    setExpiry(ORDER_EXPIRY_TIME.SIX_MONTHS);
                    if (token) {
                      token.orderExpiry = ORDER_EXPIRY_TIME.SIX_MONTHS;
                    } else if (collection) {
                      collection.offerExpiry = ORDER_EXPIRY_TIME.SIX_MONTHS;
                    }
                  }
                },
                {
                  label: ORDER_EXPIRY_TIME.YEAR,
                  onClick: () => {
                    onEditComplete?.(price);
                    setExpiry(ORDER_EXPIRY_TIME.YEAR);
                    if (token) {
                      token.orderExpiry = ORDER_EXPIRY_TIME.YEAR;
                    } else if (collection) {
                      collection.offerExpiry = ORDER_EXPIRY_TIME.YEAR;
                    }
                  }
                }
              ]}
            />
          )}

          <div className={twMerge('flex flex-col items-end')}>
            <div className="flex flex-row">
              <div className={twMerge('')}>{nFormatter(Number(price), 2)}</div>
              <div className={twMerge('ml-1')}>{EthSymbol}</div>
            </div>
            {!hideExpiry && <div className={twMerge(secondaryTextColor, 'text-xs font-medium')}>{expiry}</div>}
          </div>
        </div>
      ) : (
        <TextInputBox
          inputClassName="text-sm text-right mr-2 font-body"
          className="p-[6.5px]"
          autoFocus={true}
          addEthSymbol={true}
          type="number"
          value={price}
          placeholder="Price"
          onChange={(value) => {
            let parsedValue = parseFloat(value);
            if (parsedValue < 0) {
              parsedValue = 0;
              setPrice(String(parsedValue));
            } else {
              setPrice(String(value));
            }
            // onEditComplete?.(value);
            if (token) {
              token.orderPriceEth = parsedValue;
            } else if (collection) {
              collection.offerPriceEth = parsedValue;
            }
          }}
          onEnter={() => {
            onEditComplete?.(price);
          }}
          onMouseLeave={() => {
            onEditComplete?.(price);
          }}
        />
      )}
    </div>
  );
};
