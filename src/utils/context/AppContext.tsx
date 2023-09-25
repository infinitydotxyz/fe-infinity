import { JsonRpcSigner } from '@ethersproject/providers';
import { ERC721ABI, FlowExchangeABI } from '@infinityxyz/lib-frontend/abi';
import { ChainNFTs } from '@infinityxyz/lib-frontend/types/core';
import { getExchangeAddress, trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { adaptEthersSigner } from '@reservoir0x/ethers-wallet-adapter';
import { Execute } from '@reservoir0x/reservoir-sdk';
import { Contract, ethers } from 'ethers';
import { useTheme } from 'next-themes';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { toastError, toastSuccess } from 'src/components/common';
import { WaitingForTxModal } from 'src/components/common/waiting-for-tx-modal';
import { useChain } from 'src/hooks/useChain';
import { useCollectionSelection } from 'src/hooks/useCollectionSelection';
import { useNFTSelection } from 'src/hooks/useNFTSelection';
import { useOrderSelection } from 'src/hooks/useOrderSelection';
import { CollectionPageTabs, ProfileTabs } from 'src/utils';
import { approveERC721ForChainNFTs, cancelMultipleOrders } from 'src/utils/orders';
import { ERC721CollectionCartItem, ERC721OrderCartItem, ERC721TokenCartItem } from 'src/utils/types';
import { useAccount, useBalance, useProvider, useSigner } from 'wagmi';
import { getReservoirClient } from '../astra-utils';
import { extractErrorMsg, getDefaultOrderExpiryTime, getOrderExpiryTimeInMsFromEnum } from '../common-utils';
import { FEE_BPS, FEE_WALLET_ADDRESS, FLOW_TOKEN, Native, ROYALTY_BPS, WNative } from '../constants';
import { fetchMinXflBalanceForZeroFee } from '../orderbook-utils';
import { CartType, useCartContext } from './CartContext';
import { Signature, useUserSignature } from 'src/hooks/api/useUserSignature';
import { switchNetwork } from '@wagmi/core';

type ReservoirOrderbookType =
  | 'reservoir'
  | 'blur'
  | 'looks-rare'
  | 'x2y2'
  | 'universe'
  | 'flow'
  | 'opensea'
  | undefined;

type ReservoirOrderKindType =
  | 'seaport-v1.5'
  | 'blur'
  | 'looks-rare'
  | 'looks-rare-v2'
  | 'zeroex-v4'
  | 'seaport'
  | 'seaport-v1.4'
  | 'x2y2'
  | 'universe'
  | 'flow'
  | 'alienswap'
  | undefined;

type AppContextType = {
  selectedChain: string;
  chainName: string;
  isWalletNetworkSupported: boolean;

  showCart: boolean;
  setShowCart: (value: boolean) => void;

  selectedProfileTab: string;
  setSelectedProfileTab: (value: string) => void;

  selectedCollectionTab: string;
  setSelectedCollectionTab: (value: string) => void;

  isCheckingOut: boolean;
  setIsCheckingOut: (value: boolean) => void;

  checkoutBtnStatus: string;
  setCheckoutBtnStatus: (value: string) => void;

  setTxnHash: (value: string) => void;

  listMode: boolean;
  setListMode: (value: boolean) => void;

  handleTokenSend: (selection: ERC721TokenCartItem[], sendToAddress: string) => Promise<boolean>;
  handleTokenCheckout: (selection: ERC721TokenCartItem[]) => Promise<boolean>;
  handleCollCheckout: (selection: ERC721CollectionCartItem[]) => Promise<boolean>;
  handleOrdersCancel: (selection: ERC721OrderCartItem[]) => Promise<boolean>;

  refreshData: () => void;
  refreshTrigger: number;

  toggleNFTSelection: (data: ERC721TokenCartItem) => void;
  toggleMultipleNFTSelection: (data: ERC721TokenCartItem[]) => void;
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

  signature: Signature | null;
  signIn: () => Promise<void>;
  isSigning: boolean;
};

const AppContext = React.createContext<AppContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: Props) => {
  const { selectedChain, chainName, isWalletNetworkSupported } = useChain();
  const { signature, sign: signIn, isSigning } = useUserSignature();
  if (!isWalletNetworkSupported) {
    switchNetwork({
      chainId: 1
    }).catch((err) => {
      console.error('failed to switch network', err);
    });
  }

  const [showCart, setShowCart] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedProfileTab, setSelectedProfileTab] = useState(ProfileTabs.Items.toString());
  const [selectedCollectionTab, setSelectedCollectionTab] = useState(CollectionPageTabs.Buy.toString());

  const [listMode, setListMode] = useState(false);
  const [txnHash, setTxnHash] = useState<string>('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutBtnStatus, setCheckoutBtnStatus] = useState('Working');

  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: user } = useAccount();
  const { cartType } = useCartContext();

  const { theme } = useTheme();
  const darkMode = theme === 'dark';

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

  const {
    isNFTSelected,
    isNFTSelectable,
    toggleNFTSelection,
    toggleMultipleNFTSelection,
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

  useEffect(() => {
    refreshData();
  }, []);

  async function sendSingleNft(signer: JsonRpcSigner, collectionAddress: string, tokenId: string, toAddress: string) {
    const erc721 = new Contract(collectionAddress, ERC721ABI, signer);
    // perform send
    setCheckoutBtnStatus('Awaiting wallet confirmation');
    const from = await signer.getAddress();
    const transferResult = await erc721['safeTransferFrom(address,address,uint256)'](from, toAddress, tokenId);
    return {
      hash: transferResult?.hash ?? ''
    };
  }

  async function sendMultipleNfts(signer: JsonRpcSigner, chainId: string, orderItems: ChainNFTs[], toAddress: string) {
    const exchangeAddress = getExchangeAddress(chainId);
    const flowExchange = new Contract(exchangeAddress, FlowExchangeABI, signer);
    // grant approvals
    setCheckoutBtnStatus('Awaiting approval confirmation');
    const results = await approveERC721ForChainNFTs(orderItems, signer, exchangeAddress);
    if (results.length > 0) {
      const lastApprovalTx = results[results.length - 1];
      setTxnHash(lastApprovalTx.hash);
      setCheckoutBtnStatus('Awaiting approval txns');
      await lastApprovalTx.wait();
    }

    // perform send
    setCheckoutBtnStatus('Awaiting wallet confirmation');
    const transferResult = await flowExchange.transferMultipleNFTs(toAddress, orderItems);
    return {
      hash: transferResult?.hash ?? ''
    };
  }

  const handleTokenSend = async (nftsToSend: ERC721TokenCartItem[], sendToAddress: string): Promise<boolean> => {
    const orderItems: ChainNFTs[] = [];
    const collectionToTokenMap: { [collection: string]: { tokenId: string; numTokens: number }[] } = {};

    // group tokens by collections
    setCheckoutBtnStatus('Grouping by collections');
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
    setCheckoutBtnStatus('Adding items');
    for (const item in collectionToTokenMap) {
      const tokens = collectionToTokenMap[item];
      orderItems.push({
        collection: item,
        tokens
      });
    }

    try {
      if (sendToAddress) {
        if (signer) {
          let result;
          if (nftsToSend.length === 1) {
            setCheckoutBtnStatus('Sending single NFT');
            const nftToSend = nftsToSend[0];
            result = await sendSingleNft(
              signer as JsonRpcSigner,
              nftToSend.address ?? nftToSend.tokenAddress ?? '',
              nftToSend.tokenId ?? '',
              sendToAddress
            );
          } else {
            setCheckoutBtnStatus('Sending multiple NFTs');
            result = await sendMultipleNfts(signer as JsonRpcSigner, selectedChain, orderItems, sendToAddress);
          }
          if (result.hash) {
            setTxnHash(result.hash);
          }

          return true;
        } else {
          console.error('Signer is null');
        }
      } else {
        toastError('Send to address is blank', darkMode);
      }
    } catch (err) {
      toastError(extractErrorMsg(err), darkMode);
    }

    return false;
  };

  const handleTokenCheckout = async (tokens: ERC721TokenCartItem[]): Promise<boolean> => {
    try {
      if (!user || !signer) {
        toastError('No logged in user', darkMode);
      } else {
        const isBuyCart = cartType === CartType.TokenBuy;
        const isListCart = cartType === CartType.TokenList;
        const isBidCart = cartType === CartType.TokenBid;
        const isCancelCart = cartType === CartType.Cancel;
        const isAcceptOfferCart = cartType === CartType.AcceptOffer;

        if (isAcceptOfferCart) {
          const client = getReservoirClient(selectedChain);
          const tokenSet = [];
          for (const token of tokens) {
            const collection = trimLowerCase(token.address || token.tokenAddress || '');
            const tokenId = token.tokenId;
            if (!collection || !tokenId) {
              continue;
            }
            tokenSet.push({ token: `${collection}:${tokenId}` });
          }
          await client.actions.acceptOffer({
            items: tokenSet,
            wallet: adaptEthersSigner(signer),
            chainId: Number(selectedChain),
            onProgress: (steps: Execute['steps']) => {
              for (const step of steps) {
                setCheckoutBtnStatus(step.action || 'Working');
              }
            },
            options: {
              normalizeRoyalties: false,
              partial: false,
              allowInactiveOrderIds: false
            }
          });
          toastSuccess('Sale Complete', darkMode);
          return true;
        }

        if (isCancelCart) {
          const client = getReservoirClient(selectedChain);
          const orderIds = tokens.map((token) => token.id);
          await client.actions.cancelOrder({
            ids: orderIds,
            wallet: adaptEthersSigner(signer),
            chainId: Number(selectedChain),
            onProgress: (steps: Execute['steps']) => {
              for (const step of steps) {
                setCheckoutBtnStatus(step.action || 'Working');
              }
            }
          });
          toastSuccess('Order(s) Cancelled', darkMode);
          return true;
        }

        if (isBuyCart) {
          const client = getReservoirClient(selectedChain);
          const tokenSet = [];
          for (const token of tokens) {
            const collection = trimLowerCase(token.address || token.tokenAddress || '');
            const tokenId = token.tokenId;
            if (!collection || !tokenId) {
              continue;
            }
            tokenSet.push({ token: `${collection}:${tokenId}` });
          }

          await client.actions.buyToken({
            items: tokenSet,
            wallet: adaptEthersSigner(signer),
            chainId: Number(selectedChain),
            onProgress: (steps: Execute['steps']) => {
              for (const step of steps) {
                setCheckoutBtnStatus(step.action || 'Working');
              }
            }
          });
          toastSuccess('Buy Complete', darkMode);
          return true;
        } else if (isListCart) {
          // prepare orders
          const client = getReservoirClient(selectedChain);
          const tokenSet = [];
          const currentBlock = await provider.getBlock('latest');
          const listingTimeSeconds = currentBlock.timestamp;

          // calculate fees
          let automatedRoyalties = true;
          let fees = [`${FEE_WALLET_ADDRESS}:${FEE_BPS}`];
          const minBal = await fetchMinXflBalanceForZeroFee();
          if (minBal) {
            const feesWaived =
              xflBalance >= minBal ||
              blurBalance >= minBal ||
              looksBalance >= minBal ||
              x2y2Balance >= minBal ||
              sudoBalance >= minBal;

            if (feesWaived) {
              automatedRoyalties = false;
              fees = [];
            }
          }

          for (const token of tokens) {
            const collection = trimLowerCase(token.address || token.tokenAddress || '');
            const tokenId = token.tokenId;
            if (!collection || !tokenId) {
              continue;
            }

            const ethPrice = token.orderPriceEth ?? 0;
            if (ethPrice === 0) {
              throw new Error('Price cannot be 0');
            }
            const weiPrice = ethers.utils.parseEther(ethPrice.toString()).toString();

            const currency = Native[parseInt(selectedChain, 10)];
            if (!currency) {
              throw new Error(`Unsupported network`);
            }

            const expiry = token.orderExpiry ?? getDefaultOrderExpiryTime();
            const endTimeSeconds = getOrderExpiryTimeInMsFromEnum(listingTimeSeconds * 1000, expiry) / 1000;
            tokenSet.push({
              token: `${collection}:${tokenId}`,
              weiPrice,
              listingTime: listingTimeSeconds.toString(),
              expirationTime: endTimeSeconds.toString(),
              orderbook: 'reservoir' as ReservoirOrderbookType,
              orderKind: 'seaport-v1.5' as ReservoirOrderKindType,
              automatedRoyalties,
              royaltyBps: ROYALTY_BPS,
              fees,
              currency: currency,
              options: {
                'seaport-v1.5': {
                  useOffChainCancellation: true
                }
              }
            });
          }

          // list
          await client.actions.listToken({
            chainId: Number(selectedChain),
            listings: tokenSet,
            wallet: adaptEthersSigner(signer),
            onProgress: (steps: Execute['steps']) => {
              for (const step of steps) {
                setCheckoutBtnStatus(step.action || 'Working');
              }
            }
          });
          toastSuccess('Listing Complete', darkMode);
          return true;
        } else if (isBidCart) {
          const client = getReservoirClient(selectedChain);
          const tokenSet = [];
          const currentBlock = await provider.getBlock('latest');
          const bidTimeSeconds = currentBlock.timestamp;

          const currency = WNative[parseInt(selectedChain, 10)];
          if (!currency) {
            throw new Error(`Unsupported network`);
          }

          for (const token of tokens) {
            const collection = trimLowerCase(token.address || token.tokenAddress || '');
            const tokenId = token.tokenId;
            if (!collection || !tokenId) {
              continue;
            }

            const ethPrice = token.orderPriceEth ?? 0;
            if (ethPrice === 0) {
              throw new Error('Price cannot be 0');
            }
            const weiPrice = ethers.utils.parseEther(ethPrice.toString()).toString();

            const expiry = token.orderExpiry ?? getDefaultOrderExpiryTime();
            const endTimeSeconds = getOrderExpiryTimeInMsFromEnum(bidTimeSeconds * 1000, expiry) / 1000;
            tokenSet.push({
              token: `${collection}:${tokenId}`,
              weiPrice,
              listingTime: bidTimeSeconds.toString(),
              expirationTime: endTimeSeconds.toString(),
              orderbook: 'reservoir' as ReservoirOrderbookType,
              orderKind: 'seaport-v1.5' as ReservoirOrderKindType,
              automatedRoyalties: false,
              fees: [],
              currency: currency,
              options: {
                'seaport-v1.5': {
                  useOffChainCancellation: true
                }
              }
            });
          }

          // bid
          await client.actions.placeBid({
            chainId: Number(selectedChain),
            bids: tokenSet,
            wallet: adaptEthersSigner(signer),
            onProgress: (steps: Execute['steps']) => {
              for (const step of steps) {
                setCheckoutBtnStatus(step.action || 'Working');
              }
            }
          });
          toastSuccess('Bidding Complete', darkMode);
          return true;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (ex: any) {
      const errorMsg = ex.response?.data?.message ?? ex.message;
      toastError(errorMsg, darkMode);
    }

    return false;
  };

  const handleCollCheckout = async (collections: ERC721CollectionCartItem[]): Promise<boolean> => {
    try {
      if (!user || !signer) {
        toastError('No logged in user', darkMode);
      } else {
        const isCollBidCart = cartType === CartType.CollectionBid;
        const isCancelCart = cartType === CartType.Cancel;

        if (isCancelCart) {
          const client = getReservoirClient(selectedChain);
          const orderIds = collections.map((collection) => collection.id ?? '');
          // remove empty ids
          const orderIdsNonEmpty = orderIds.filter((id) => id !== '');
          await client.actions.cancelOrder({
            ids: orderIdsNonEmpty,
            wallet: adaptEthersSigner(signer),
            chainId: Number(selectedChain),
            onProgress: (steps: Execute['steps']) => {
              for (const step of steps) {
                setCheckoutBtnStatus(step.action || 'Working');
              }
            }
          });
          toastSuccess('Cancel Complete', darkMode);
          return true;
        }

        if (isCollBidCart) {
          const client = getReservoirClient(selectedChain);
          const collectionSet = [];
          const currentBlock = await provider.getBlock('latest');
          const bidTimeSeconds = currentBlock.timestamp;

          const currency = WNative[parseInt(selectedChain, 10)];
          if (!currency) {
            throw new Error(`Unsupported network`);
          }

          for (const collection of collections) {
            if (!collection.address) {
              continue;
            }

            const ethPrice = collection.offerPriceEth ?? 0;
            if (ethPrice === 0) {
              throw new Error('Price cannot be 0');
            }
            const weiPrice = ethers.utils.parseEther(ethPrice.toString()).toString();

            const expiry = collection.offerExpiry ?? getDefaultOrderExpiryTime();
            const endTimeSeconds = getOrderExpiryTimeInMsFromEnum(bidTimeSeconds * 1000, expiry) / 1000;
            collectionSet.push({
              collection: collection.address,
              weiPrice,
              listingTime: bidTimeSeconds.toString(),
              expirationTime: endTimeSeconds.toString(),
              orderbook: 'reservoir' as ReservoirOrderbookType,
              orderKind: 'seaport-v1.5' as ReservoirOrderKindType,
              automatedRoyalties: false,
              currency,
              options: {
                'seaport-v1.5': {
                  useOffChainCancellation: true
                }
              }
            });
          }

          // bid
          await client.actions.placeBid({
            chainId: Number(selectedChain),
            bids: collectionSet,
            wallet: adaptEthersSigner(signer),
            onProgress: (steps: Execute['steps']) => {
              for (const step of steps) {
                setCheckoutBtnStatus(step.action || 'Working');
              }
            }
          });
          toastSuccess('Bidding Complete', darkMode);
          return true;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (ex: any) {
      console.error(ex);
      const errorMsg = ex.response?.data?.message ?? ex.message;
      toastError(errorMsg, darkMode);
    }

    return false;
  };

  const handleOrdersCancel = async (ordersToCancel: ERC721OrderCartItem[]): Promise<boolean> => {
    try {
      if (signer) {
        setCheckoutBtnStatus('Mapping nonces');
        const nonces = ordersToCancel.map((order) => order.nonce);
        setCheckoutBtnStatus('Awaiting wallet confirmation');
        const { hash } = await cancelMultipleOrders(signer as JsonRpcSigner, selectedChain, nonces);
        toastSuccess('Sent txn to chain for execution', darkMode);
        setTxnHash(hash);
        return true;
      } else {
        throw 'Signer is null';
      }
    } catch (err) {
      toastError(extractErrorMsg(err), darkMode);
    }

    return false;
  };

  const refreshData = () => {
    // updating fetchers triggers rebuild
    setRefreshTrigger(refreshTrigger + 1);
  };

  const value: AppContextType = {
    selectedChain,
    chainName,
    isWalletNetworkSupported,

    showCart,
    setShowCart,

    selectedProfileTab,
    setSelectedProfileTab,

    selectedCollectionTab,
    setSelectedCollectionTab,

    isCheckingOut,
    setIsCheckingOut,

    checkoutBtnStatus,
    setCheckoutBtnStatus,

    setTxnHash,

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
    toggleMultipleNFTSelection,
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
    removeOrderFromSelection,

    signature,
    signIn,
    isSigning
  };

  return (
    <AppContext.Provider value={value}>
      <>
        {children}{' '}
        {txnHash ? (
          <WaitingForTxModal title={'Awaiting transaction'} txHash={txnHash} onClose={() => setTxnHash('')} />
        ) : null}
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
