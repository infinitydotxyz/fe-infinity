import {
  ChainId,
  ChainNFTs,
  OBOrder,
  OBOrderItem,
  OBTokenInfo,
  SignedOBOrder
} from '@infinityxyz/lib-frontend/types/core';
import { getOBComplicationAddress, getTxnCurrencyAddress, trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useRouter } from 'next/router';
import { ProfileTabs } from 'pages/profile/[address]';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { toastError, toastInfo, toastSuccess, toastWarning } from 'src/components/common';
import { WaitingForTxModal } from 'src/components/orderbook/waiting-for-tx-modal';
import { useCollectionSelection } from 'src/hooks/useCollectionSelection';
import { useNFTSelection } from 'src/hooks/useNFTSelection';
import { useOrderSelection } from 'src/hooks/useOrderSelection';
import { cancelMultipleOrders } from 'src/utils/orders';
import { ERC721CollectionCartItem, ERC721OrderCartItem, ERC721TokenCartItem } from 'src/utils/types';
import {
  ellipsisAddress,
  extractErrorMsg,
  getCartType,
  getDefaultOrderExpiryTime,
  getEstimatedGasPrice,
  getOrderExpiryTimeInMsFromEnum
} from '../common-utils';
import { DEFAULT_MAX_GAS_PRICE_WEI, ZERO_ADDRESS } from '../constants';
import { fetchOrderNonce, postOrdersV2 } from '../orderbook-utils';
import { getSignedOBOrder, sendMultipleNfts, sendSingleNft } from '../orders';
import { CartType } from './CartContext';
import { useOnboardContext } from './OnboardContext/OnboardContext';

export type User = {
  address: string;
  username?: string;
};

type AppContextType = {
  showCart: boolean;
  setShowCart: (value: boolean) => void;

  selectedProfileTab: string;
  setSelectedProfileTab: (value: string) => void;

  listMode: boolean;
  setListMode: (value: boolean) => void;

  handleTokenSend: (selection: ERC721TokenCartItem[], sendToAddress: string) => Promise<boolean>;
  handleTokenCheckout: (selection: ERC721TokenCartItem[]) => Promise<boolean>;
  handleCollCheckout: (selection: ERC721CollectionCartItem[]) => Promise<boolean>;
  handleOrdersCancel: (selection: ERC721OrderCartItem[]) => Promise<boolean>;

  refreshData: () => void;
  refreshTrigger: number;

  toggleNFTSelection: (data: ERC721TokenCartItem) => void;
  isNFTSelected: (data: ERC721TokenCartItem) => boolean;
  isNFTSelectable: (data: ERC721TokenCartItem) => boolean;
  removeNFTFromSelection: (data: ERC721TokenCartItem) => void;
  nftSelection: ERC721TokenCartItem[];
  clearNFTSelection: () => void;

  toggleCollSelection: (data: ERC721CollectionCartItem) => void;
  isCollSelected: (data: ERC721CollectionCartItem) => boolean;
  isCollSelectable: (data: ERC721CollectionCartItem) => boolean;
  removeCollFromSelection: (data: ERC721CollectionCartItem) => void;
  collSelection: ERC721CollectionCartItem[];
  clearCollSelection: () => void;

  toggleOrderSelection: (data: ERC721OrderCartItem) => void;
  isOrderSelected: (data: ERC721OrderCartItem) => boolean;
  removeOrderFromSelection: (data: ERC721OrderCartItem) => void;
  orderSelection: ERC721OrderCartItem[];
  clearOrderSelection: () => void;
};

const AppContext = React.createContext<AppContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: Props) => {
  const [showCart, setShowCart] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedProfileTab, setSelectedProfileTab] = useState(ProfileTabs.Items.toString());
  const [listMode, setListMode] = useState(false);
  const [txnHash, setTxnHash] = useState<string>('');
  const { getSigner, getEthersProvider, user, chainId, waitForTransaction } = useOnboardContext();
  const {
    isNFTSelected,
    isNFTSelectable,
    toggleNFTSelection,
    clearNFTSelection,
    nftSelection,
    removeNFTFromSelection
  } = useNFTSelection();
  const {
    isCollSelected,
    isCollSelectable,
    toggleCollSelection,
    clearCollSelection,
    collSelection,
    removeCollFromSelection
  } = useCollectionSelection();
  const { isOrderSelected, toggleOrderSelection, clearOrderSelection, orderSelection, removeOrderFromSelection } =
    useOrderSelection();

  const router = useRouter();

  useEffect(() => {
    refreshData();
  }, []);

  const handleTokenSend = async (nftsToSend: ERC721TokenCartItem[], sendToAddress: string): Promise<boolean> => {
    const orderItems: ChainNFTs[] = [];
    const collectionToTokenMap: { [collection: string]: { tokenId: string; numTokens: number }[] } = {};

    // group tokens by collections
    for (const nftToSend of nftsToSend) {
      const collection = trimLowerCase(nftToSend.address);
      const tokenId = nftToSend.tokenId;
      if (!collection || !tokenId) {
        continue;
      }
      const numTokens = 1;
      const tokens = collectionToTokenMap[collection] ?? [];
      tokens.push({ tokenId, numTokens });
      collectionToTokenMap[collection] = tokens;
    }

    // add to orderItems
    for (const item in collectionToTokenMap) {
      const tokens = collectionToTokenMap[item];
      orderItems.push({
        collection: item,
        tokens
      });
    }

    try {
      if (sendToAddress) {
        const signer = getSigner();
        if (signer) {
          let result;
          if (nftsToSend.length === 1) {
            const nftToSend = nftsToSend[0];
            result = await sendSingleNft(
              signer,
              chainId,
              nftToSend.address ?? nftToSend.tokenAddress ?? '',
              nftToSend.tokenId ?? '',
              sendToAddress
            );
          } else {
            result = await sendMultipleNfts(signer, chainId, orderItems, sendToAddress);
          }
          if (result.hash) {
            setTxnHash(result.hash);
          }

          return true;
        } else {
          console.error('Signer is null');
        }
      } else {
        toastWarning('To address is blank');
      }
    } catch (err) {
      toastError(extractErrorMsg(err));
    }

    return false;
  };

  const handleTokenCheckout = async (tokens: ERC721TokenCartItem[]): Promise<boolean> => {
    const signer = getSigner();
    try {
      if (!user || !user.address || !signer) {
        toastError('No logged in user');
      } else {
        const cartType = getCartType(router.asPath, selectedProfileTab);
        const isBuyCart = cartType === CartType.TokenOffer;
        const isSellCart = cartType === CartType.TokenList;
        const isSendCart = cartType === CartType.Send;

        if (!isSendCart) {
          // place orders
          // first sign orders
          const signedOrders: SignedOBOrder[] = [];
          let orderNonce = await fetchOrderNonce(user.address, chainId as ChainId);
          for (const token of tokens) {
            let order;
            if (isBuyCart) {
              order = await tokenToOBOrder(token, orderNonce, false);
            } else if (isSellCart) {
              order = await tokenToOBOrder(token, orderNonce, true);
            }
            orderNonce += 1;
            if (order) {
              const signedOrder = await getSignedOBOrder(user, chainId, signer, order);
              if (signedOrder) {
                signedOrders.push(signedOrder);
              }
            }
          }

          // post orders
          if (signedOrders.length > 0) {
            await postOrdersV2(chainId as ChainId, signedOrders);
            toastSuccess('Orders posted');
          }
          return true;
        }
      }
    } catch (ex) {
      console.error(ex);
      toastError(`${ex}`);
    }

    return false;
  };

  const handleCollCheckout = async (collections: ERC721CollectionCartItem[]): Promise<boolean> => {
    const signer = getSigner();
    try {
      if (!user || !user.address || !signer) {
        toastError('No logged in user');
      } else {
        // sign orders
        const signedOrders: SignedOBOrder[] = [];
        let orderNonce = await fetchOrderNonce(user.address, chainId as ChainId);
        for (const collection of collections) {
          const order = await collectionToOBOrder(collection, orderNonce);
          orderNonce += 1;
          if (order) {
            const signedOrder = await getSignedOBOrder(user, chainId, signer, order);
            if (signedOrder) {
              signedOrders.push(signedOrder);
            }
          }
        }

        // post orders
        if (signedOrders.length > 0) {
          await postOrdersV2(chainId as ChainId, signedOrders);
          toastSuccess('Orders posted');
        }

        return true;
      }
    } catch (ex) {
      console.error(ex);
      toastError(`${ex}`);
    }

    return false;
  };

  const handleOrdersCancel = async (ordersToCancel: ERC721OrderCartItem[]): Promise<boolean> => {
    try {
      const signer = getSigner();
      if (signer) {
        const nonces = ordersToCancel.map((order) => order.nonce);
        const { hash } = await cancelMultipleOrders(signer, chainId, nonces);
        toastSuccess('Sent txn to chain for execution');
        waitForTransaction(hash, () => {
          toastInfo(`Transaction confirmed ${ellipsisAddress(hash)}`);
        });

        return true;
      } else {
        throw 'Signer is null';
      }
    } catch (err) {
      toastError(extractErrorMsg(err));
    }

    return false;
  };

  const tokenToOBOrder = async (
    token: ERC721TokenCartItem,
    orderNonce: number,
    isSellOrder: boolean
  ): Promise<OBOrder | undefined> => {
    try {
      let currencyAddress = getTxnCurrencyAddress(chainId);
      if (isSellOrder) {
        currencyAddress = ZERO_ADDRESS; // sell orders are always in ETH
      }
      const gasPrice = await getEstimatedGasPrice(getEthersProvider());
      const ethPrice = token.orderPriceEth ?? 0;
      if (ethPrice === 0) {
        throw new Error('Price is 0');
      }
      const expiry = token.orderExpiry ?? getDefaultOrderExpiryTime();
      const endTimeMs = getOrderExpiryTimeInMsFromEnum(expiry);
      const obTokenInfo: OBTokenInfo = {
        tokenId: token.tokenId ?? '',
        tokenName: token.name ?? '',
        tokenImage: token.image ?? token.cardImage ?? token.imagePreview ?? '',
        numTokens: 1, // always 1 for ERC721
        takerAddress: '',
        takerUsername: '',
        attributes: token.attributes ?? []
      };
      const obOrderItem: OBOrderItem = {
        chainId: token.chainId as ChainId,
        collectionAddress: token.address ?? '',
        collectionName: token.collectionName ?? '',
        collectionImage: '',
        collectionSlug: token.collectionSlug ?? '',
        hasBlueCheck: token.hasBlueCheck ?? false,
        tokens: [obTokenInfo]
      };
      const order: OBOrder = {
        id: '',
        chainId: token.chainId ?? '1',
        isSellOrder,
        makerAddress: user?.address ?? '',
        numItems: 1, // defaulting to one for now; m of n orders not supported in this release via FE
        startTimeMs: Date.now(),
        endTimeMs,
        startPriceEth: ethPrice,
        endPriceEth: ethPrice,
        nfts: [obOrderItem],
        makerUsername: '', // filled in BE
        nonce: orderNonce,
        maxGasPriceWei: gasPrice ?? DEFAULT_MAX_GAS_PRICE_WEI,
        execParams: {
          currencyAddress,
          complicationAddress: getOBComplicationAddress(chainId)
        },
        extraParams: {
          buyer: ''
        }
      };
      return order;
    } catch (err) {
      console.error(err);
    }
  };

  const collectionToOBOrder = async (
    collection: ERC721CollectionCartItem,
    orderNonce: number
  ): Promise<OBOrder | undefined> => {
    try {
      const currencyAddress = getTxnCurrencyAddress(chainId);
      const gasPrice = await getEstimatedGasPrice(getEthersProvider());
      const ethPrice = collection.offerPriceEth ?? 0;
      if (ethPrice === 0) {
        throw new Error('Price is 0');
      }
      const expiry = collection.offerExpiry ?? getDefaultOrderExpiryTime();
      const endTimeMs = getOrderExpiryTimeInMsFromEnum(expiry);
      const obOrderItem: OBOrderItem = {
        chainId: collection.chainId as ChainId,
        collectionAddress: collection.address,
        collectionName: collection.metadata.name,
        collectionImage: collection.metadata.profileImage,
        collectionSlug: collection.slug,
        hasBlueCheck: collection.hasBlueCheck,
        tokens: []
      };
      const order: OBOrder = {
        id: '',
        chainId: collection.chainId,
        isSellOrder: false, // collection orders are always buys
        makerAddress: user?.address ?? '',
        numItems: 1, // defaulting to one for now; m of n orders not supported in this release via FE
        startTimeMs: Date.now(),
        endTimeMs,
        startPriceEth: ethPrice,
        endPriceEth: ethPrice,
        nfts: [obOrderItem],
        makerUsername: '', // filled in BE
        nonce: orderNonce,
        maxGasPriceWei: gasPrice ?? DEFAULT_MAX_GAS_PRICE_WEI,
        execParams: {
          currencyAddress,
          complicationAddress: getOBComplicationAddress(chainId)
        },
        extraParams: {
          buyer: ''
        }
      };
      return order;
    } catch (err) {
      console.error(err);
    }
  };

  const refreshData = () => {
    // updating fetchers triggers rebuild
    setRefreshTrigger(refreshTrigger + 1);
  };

  const value: AppContextType = {
    showCart,
    setShowCart,

    selectedProfileTab,
    setSelectedProfileTab,

    listMode,
    setListMode,

    handleTokenSend,
    handleTokenCheckout,
    handleCollCheckout,
    handleOrdersCancel,
    refreshData,
    refreshTrigger,

    isNFTSelected,
    isNFTSelectable,
    toggleNFTSelection,
    clearNFTSelection,
    nftSelection,
    removeNFTFromSelection,

    isCollSelected,
    isCollSelectable,
    toggleCollSelection,
    clearCollSelection,
    collSelection,
    removeCollFromSelection,

    isOrderSelected,
    toggleOrderSelection,
    clearOrderSelection,
    orderSelection,
    removeOrderFromSelection
  };

  return (
    <AppContext.Provider value={value}>
      <>
        {children}{' '}
        {txnHash && <WaitingForTxModal title={'Sending NFTs'} txHash={txnHash} onClose={() => setTxnHash('')} />}
        <ToastContainer
          limit={3}
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          progressClassName="toastify-custom-progress-bar"
        />
      </>
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  return useContext(AppContext) as AppContextType;
};
