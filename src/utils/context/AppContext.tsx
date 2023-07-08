import { JsonRpcSigner } from '@ethersproject/providers';
import { ERC721ABI, FlowExchangeABI } from '@infinityxyz/lib-frontend/abi';
import {
  ChainId,
  ChainNFTs,
  ChainOBOrder,
  OBOrder,
  OBOrderItem,
  OBTokenInfo,
  SignedOBOrder
} from '@infinityxyz/lib-frontend/types/core';
import {
  ETHEREUM_WETH_ADDRESS,
  NULL_ADDRESS,
  getCurrentOBOrderPrice,
  getExchangeAddress,
  getOBComplicationAddress,
  getTxnCurrencyAddress,
  trimLowerCase
} from '@infinityxyz/lib-frontend/utils';
import { adaptEthersSigner } from '@reservoir0x/ethers-wallet-adapter';
import { Execute } from '@reservoir0x/reservoir-sdk';
import { Contract, ethers } from 'ethers';
import { defaultAbiCoder, parseEther } from 'ethers/lib/utils.js';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { toastError, toastSuccess, toastWarning } from 'src/components/common';
import { WaitingForTxModal } from 'src/components/common/waiting-for-tx-modal';
import { useStakerContract } from 'src/hooks/contract/staker/useStakerContract';
import { useChain } from 'src/hooks/useChain';
import { useCollectionSelection } from 'src/hooks/useCollectionSelection';
import { useNFTSelection } from 'src/hooks/useNFTSelection';
import { useOrderSelection } from 'src/hooks/useOrderSelection';
import { CollectionPageTabs, ProfileTabs } from 'src/utils';
import {
  approveERC20,
  approveERC721,
  approveERC721ForChainNFTs,
  cancelMultipleOrders,
  checkERC20Balance,
  checkOnChainOwnership,
  signBulkOrders,
  signSingleOrder
} from 'src/utils/orders';
import { ERC721CollectionCartItem, ERC721OrderCartItem, ERC721TokenCartItem } from 'src/utils/types';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';
import { getReservoirClient } from '../astra-utils';
import {
  extractErrorMsg,
  getDefaultOrderExpiryTime,
  getEstimatedGasPrice,
  getOrderExpiryTimeInMsFromEnum
} from '../common-utils';
import { DEFAULT_MAX_GAS_PRICE_WEI, ROYALTY_BPS, ZERO_ADDRESS } from '../constants';
import { fetchMinXflStakeForZeroFees, fetchOrderNonce, postOrdersV2 } from '../orderbook-utils';
import { CartType, useCartContext } from './CartContext';

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
  selectedChain: ChainId;
  setSelectedChain: (chain: ChainId) => void;
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
};

const AppContext = React.createContext<AppContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: Props) => {
  const { selectedChain, setSelectedChain, isWalletNetworkSupported } = useChain();
  const [showCart, setShowCart] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedProfileTab, setSelectedProfileTab] = useState(ProfileTabs.Items.toString());
  const [selectedCollectionTab, setSelectedCollectionTab] = useState(CollectionPageTabs.Buy.toString());

  const [listMode, setListMode] = useState(false);
  const [txnHash, setTxnHash] = useState<string>('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutBtnStatus, setCheckoutBtnStatus] = useState('');

  const { data: signer } = useSigner();
  const provider = useProvider();
  const { chain } = useNetwork();
  const chainId = String(chain?.id);
  const { address: user } = useAccount();
  const { cartType } = useCartContext();
  const { stakeBalance } = useStakerContract();

  useEffect(() => {
    switch (chain?.id) {
      case 1:
        setSelectedChain(ChainId.Mainnet);
        break;
      case 5:
        setSelectedChain(ChainId.Goerli);
        break;
      default:
        setSelectedChain(ChainId.Mainnet);
    }
  }, [chain]);

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

  async function signOrders(
    signer: JsonRpcSigner,
    chainId: string,
    orders: OBOrder[]
  ): Promise<SignedOBOrder[] | undefined> {
    // sign
    const flowExchangeAddress = getExchangeAddress(chainId.toString());
    const flowExchange = new Contract(flowExchangeAddress, FlowExchangeABI, signer);
    const preSignedOrders: SignedOBOrder[] = [];
    for (const order of orders) {
      const preparedOrder = await prepareOBOrder(chainId, signer, order, flowExchange);
      if (!preparedOrder) {
        throw new Error('Failed to prepare order');
      }
      preSignedOrders.push({ ...order, signedOrder: preparedOrder });
    }

    let fullySignedOrders: SignedOBOrder[] | undefined = [];

    if (preSignedOrders.length === 1) {
      setCheckoutBtnStatus('Signing order');
      fullySignedOrders = await signSingleOrder(signer, chainId, preSignedOrders);
    } else if (preSignedOrders.length > 1) {
      setCheckoutBtnStatus('Bulk signing orders');
      fullySignedOrders = await signBulkOrders(signer, chainId, preSignedOrders);
    }

    return fullySignedOrders;
  }

  async function prepareOBOrder(
    chainId: string,
    signer: JsonRpcSigner,
    order: OBOrder,
    infinityExchange: Contract
  ): Promise<ChainOBOrder | undefined> {
    // grant approvals
    setCheckoutBtnStatus('Granting approvals');
    const approvals = await grantApprovals(order, signer, infinityExchange.address);
    if (!approvals) {
      return undefined;
    }

    setCheckoutBtnStatus('Validating order');
    const validOrder = await isOrderValid(order, infinityExchange, signer);
    if (!validOrder) {
      return undefined;
    }

    const constraints = [
      order.numItems,
      parseEther(String(order.startPriceEth)),
      parseEther(String(order.endPriceEth)),
      Math.floor(order.startTimeMs / 1000),
      Math.floor(order.endTimeMs / 1000),
      order.nonce,
      order.maxGasPriceWei
    ];
    if ('isTrustedExec' in order && order.isTrustedExec) {
      constraints.push(1);
    } else {
      constraints.push(0);
    }

    const nfts: ChainNFTs[] = order.nfts.reduce((acc: ChainNFTs[], { collectionAddress, tokens }) => {
      let nft = acc.find(({ collection }) => collection === collectionAddress);
      if (!nft) {
        nft = { collection: collectionAddress, tokens: [] };
        acc.push(nft);
      }
      const chainTokens = [];
      for (const token of tokens) {
        chainTokens.push({
          tokenId: token.tokenId,
          numTokens: token.numTokens
        });
      }
      nft.tokens.push(...chainTokens);
      return acc;
    }, [] as ChainNFTs[]);

    // don't use ?? operator here
    const execParams = [
      order.execParams.complicationAddress || getOBComplicationAddress(chainId.toString()),
      order.execParams.currencyAddress || getTxnCurrencyAddress(chainId.toString())
    ];
    // don't use ?? operator here
    const extraParams = defaultAbiCoder.encode(['address'], [order.extraParams.buyer || NULL_ADDRESS]);

    const orderToSign: ChainOBOrder = {
      isSellOrder: order.isSellOrder,
      signer: order.makerAddress,
      constraints: constraints.map((item) => item.toString()),
      nfts,
      execParams,
      extraParams,
      sig: ''
    };

    return orderToSign;
  }

  async function isOrderValid(order: OBOrder, flowExchange: Contract, signer: JsonRpcSigner): Promise<boolean> {
    const user = signer._address;
    // check timestamps
    if (Date.now() > order.endTimeMs) {
      console.error('Order timestamps are not valid');
      return false;
    }

    // check if nonce is valid
    const isNonceValid = await flowExchange.isNonceValid(user, order.nonce);
    if (!isNonceValid) {
      console.error('Order nonce is not valid');
      return false;
    }

    // check on chain ownership
    if (order.isSellOrder) {
      setCheckoutBtnStatus('Checking on-chain ownership');
      const isCurrentOwner = await checkOnChainOwnership(user, order, signer);
      if (!isCurrentOwner) {
        return false;
      }
    }

    // default
    return true;
  }

  async function grantApprovals(order: OBOrder, signer: JsonRpcSigner, exchange: string): Promise<boolean> {
    if (!order.isSellOrder) {
      // approve currencies
      const currentPrice = getCurrentOBOrderPrice(order);
      setCheckoutBtnStatus('Approving currency');
      const txn = await approveERC20(order.execParams.currencyAddress, currentPrice, signer, exchange);
      await txn?.wait();

      // check if user has enough balance to fulfill this order
      await checkERC20Balance(order.execParams.currencyAddress, currentPrice, signer);
    } else {
      // approve collections
      setCheckoutBtnStatus('Approving collections');
      const results = await approveERC721(order.nfts, signer, exchange);
      if (results.length > 0) {
        const lastApprovalTx = results[results.length - 1];
        await lastApprovalTx.wait();
      }
    }
    return true;
  }

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
            result = await sendMultipleNfts(signer as JsonRpcSigner, chainId, orderItems, sendToAddress);
          }
          if (result.hash) {
            setTxnHash(result.hash);
          }

          return true;
        } else {
          console.error('Signer is null');
        }
      } else {
        toastWarning('Send to address is blank');
      }
    } catch (err) {
      toastError(extractErrorMsg(err));
    }

    return false;
  };

  const handleTokenCheckout = async (tokens: ERC721TokenCartItem[]): Promise<boolean> => {
    try {
      if (!user || !signer) {
        toastError('No logged in user');
      } else {
        const isBuyCart = cartType === CartType.TokenBuy;
        const isTokenBidIntentCart = cartType === CartType.TokenBidIntent;
        const isListCart = cartType === CartType.TokenList;
        const isBidCart = cartType === CartType.TokenBid;
        const isCancelCart = cartType === CartType.Cancel;
        const isAcceptOfferCart = cartType === CartType.AcceptOffer;

        if (isAcceptOfferCart) {
          const client = getReservoirClient(chainId);
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
            chainId: Number(chainId),
            onProgress: (steps: Execute['steps']) => {
              for (const step of steps) {
                setCheckoutBtnStatus(step.action);
              }
            },
            options: {
              normalizeRoyalties: false,
              partial: false,
              allowInactiveOrderIds: false
            }
          });
          toastSuccess('Sale Complete');
          return true;
        }

        if (isCancelCart) {
          const client = getReservoirClient(chainId);
          const orderIds = tokens.map((token) => token.id);
          await client.actions.cancelOrder({
            ids: orderIds,
            wallet: adaptEthersSigner(signer),
            chainId: Number(chainId),
            onProgress: (steps: Execute['steps']) => {
              for (const step of steps) {
                setCheckoutBtnStatus(step.action);
              }
            }
          });
          toastSuccess('Order(s) Cancelled');
          return true;
        }

        if (isBuyCart) {
          const client = getReservoirClient(chainId);
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
            chainId: Number(chainId),
            onProgress: (steps: Execute['steps']) => {
              for (const step of steps) {
                setCheckoutBtnStatus(step.action);
              }
            }
          });
          toastSuccess('Buy Complete');
          return true;
        } else if (isTokenBidIntentCart) {
          // prepare orders
          const preSignedOrders: OBOrder[] = [];
          setCheckoutBtnStatus('Fetching nonce');
          let orderNonce = await fetchOrderNonce(user, chainId as ChainId);
          const currentBlock = await provider.getBlock('latest');
          setCheckoutBtnStatus('Preparing orders');
          for (const token of tokens) {
            const order = await tokenToOBOrder(token, orderNonce, false, currentBlock.timestamp);
            orderNonce += 1;
            if (order) {
              preSignedOrders.push(order);
            }
          }

          // sign orders
          setCheckoutBtnStatus('Signing orders');
          const signedOrders: SignedOBOrder[] | undefined = await signOrders(
            signer as JsonRpcSigner,
            chainId,
            preSignedOrders
          );

          // post orders
          if (signedOrders) {
            setCheckoutBtnStatus('Sending orders');
            await postOrdersV2(chainId as ChainId, signedOrders);
            toastSuccess('Order(s) now live');
          }
          return true;
        } else if (isListCart) {
          // prepare orders
          const client = getReservoirClient(chainId);
          const tokenSet = [];
          const currentBlock = await provider.getBlock('latest');
          const listingTimeSeconds = currentBlock.timestamp;

          // calculate fees
          let automatedRoyalties = true;
          // let fees = [`${FEE_WALLET_ADDRESS}:${FEE_BPS}`];
          const fees: string[] = [];
          const minXflStakeForZeroFees = await fetchMinXflStakeForZeroFees();
          if (minXflStakeForZeroFees) {
            const xflStaked = parseFloat((await stakeBalance()) ?? '0');
            if (xflStaked >= minXflStakeForZeroFees) {
              automatedRoyalties = false;
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
              currency: ZERO_ADDRESS, // default ETH for listings and mainnet NFTs
              options: {
                'seaport-v1.5': {
                  useOffChainCancellation: true
                }
              }
            });
          }

          // list
          await client.actions.listToken({
            chainId: Number(chainId),
            listings: tokenSet,
            wallet: adaptEthersSigner(signer),
            onProgress: (steps: Execute['steps']) => {
              for (const step of steps) {
                setCheckoutBtnStatus(step.action);
              }
            }
          });
          toastSuccess('Listing Complete');
          return true;
        } else if (isBidCart) {
          const client = getReservoirClient(chainId);
          const tokenSet = [];
          const currentBlock = await provider.getBlock('latest');
          const bidTimeSeconds = currentBlock.timestamp;

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
              currency: ETHEREUM_WETH_ADDRESS, // default WETH for bids and ETH mainnet NFTs; future-todo - support other currencies for other chains
              options: {
                'seaport-v1.5': {
                  useOffChainCancellation: true
                }
              }
            });
          }

          // bid
          await client.actions.placeBid({
            chainId: Number(chainId),
            bids: tokenSet,
            wallet: adaptEthersSigner(signer),
            onProgress: (steps: Execute['steps']) => {
              for (const step of steps) {
                setCheckoutBtnStatus(step.action);
              }
            }
          });
          toastSuccess('Bidding Complete');
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
    try {
      if (!user || !signer) {
        toastError('No logged in user');
      } else {
        const isCollBidCart = cartType === CartType.CollectionBid;
        const isCollBidIntentCart = cartType === CartType.CollectionBidIntent;
        const isCancelCart = cartType === CartType.Cancel;

        if (isCancelCart) {
          const client = getReservoirClient(chainId);
          const orderIds = collections.map((collection) => collection.id ?? '');
          // remove empty ids
          const orderIdsNonEmpty = orderIds.filter((id) => id !== '');
          await client.actions.cancelOrder({
            ids: orderIdsNonEmpty,
            wallet: adaptEthersSigner(signer),
            chainId: Number(chainId),
            onProgress: (steps: Execute['steps']) => {
              for (const step of steps) {
                setCheckoutBtnStatus(step.action);
              }
            }
          });
          toastSuccess('Cancel Complete');
          return true;
        }

        if (isCollBidCart) {
          const client = getReservoirClient(chainId);
          const collectionSet = [];
          const currentBlock = await provider.getBlock('latest');
          const bidTimeSeconds = currentBlock.timestamp;

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
              currency: ETHEREUM_WETH_ADDRESS, // default WETH for bids and ETH mainnet NFTs
              options: {
                'seaport-v1.5': {
                  useOffChainCancellation: true
                }
              }
            });
          }

          // bid
          await client.actions.placeBid({
            chainId: Number(chainId),
            bids: collectionSet,
            wallet: adaptEthersSigner(signer),
            onProgress: (steps: Execute['steps']) => {
              for (const step of steps) {
                setCheckoutBtnStatus(step.action);
              }
            }
          });
          toastSuccess('Bidding Complete');
          return true;
        }

        if (isCollBidIntentCart) {
          // sign orders
          const preSignedOrders: OBOrder[] = [];
          setCheckoutBtnStatus('Fetching nonce');
          let orderNonce = await fetchOrderNonce(user, chainId as ChainId);
          const currentBlock = await provider.getBlock('latest');
          setCheckoutBtnStatus('Preparing orders');
          for (const collection of collections) {
            const order = await collectionToOBOrder(collection, orderNonce, currentBlock.timestamp);
            orderNonce += 1;
            if (order) {
              preSignedOrders.push(order);
            }
          }

          // sign orders
          setCheckoutBtnStatus('Signing orders');
          const signedOrders: SignedOBOrder[] | undefined = await signOrders(
            signer as JsonRpcSigner,
            chainId,
            preSignedOrders
          );

          // post orders
          if (signedOrders) {
            setCheckoutBtnStatus('Sending orders');
            await postOrdersV2(chainId as ChainId, signedOrders);
            toastSuccess('Order(s) now live');
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

  const handleOrdersCancel = async (ordersToCancel: ERC721OrderCartItem[]): Promise<boolean> => {
    try {
      if (signer) {
        setCheckoutBtnStatus('Mapping nonces');
        const nonces = ordersToCancel.map((order) => order.nonce);
        setCheckoutBtnStatus('Awaiting wallet confirmation');
        const { hash } = await cancelMultipleOrders(signer as JsonRpcSigner, chainId, nonces);
        toastSuccess('Sent txn to chain for execution');
        setTxnHash(hash);
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
    isSellOrder: boolean,
    startTime: number
  ): Promise<OBOrder | undefined> => {
    let currencyAddress = getTxnCurrencyAddress(chainId);
    if (isSellOrder) {
      currencyAddress = ZERO_ADDRESS; // sell orders are always in ETH
    }
    const gasPrice = await getEstimatedGasPrice(provider);
    const ethPrice = token.orderPriceEth ?? 0;
    if (ethPrice === 0) {
      throw new Error('Price cannot be 0');
    }
    const startTimeMs = startTime * 1000;
    const expiry = token.orderExpiry ?? getDefaultOrderExpiryTime();
    const endTimeMs = getOrderExpiryTimeInMsFromEnum(startTimeMs, expiry);
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
      makerAddress: user ?? '',
      numItems: 1, // defaulting to one for now; m of n orders not supported in this release via FE
      startTimeMs,
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
  };

  const collectionToOBOrder = async (
    collection: ERC721CollectionCartItem,
    orderNonce: number,
    startTime: number
  ): Promise<OBOrder | undefined> => {
    const currencyAddress = getTxnCurrencyAddress(chainId);
    const gasPrice = await getEstimatedGasPrice(provider);
    const ethPrice = collection.offerPriceEth ?? 0;
    if (ethPrice === 0) {
      throw new Error('Price cannot be 0');
    }
    const startTimeMs = startTime * 1000;
    const expiry = collection.offerExpiry ?? getDefaultOrderExpiryTime();
    const endTimeMs = getOrderExpiryTimeInMsFromEnum(startTimeMs, expiry);
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
      makerAddress: user ?? '',
      numItems: 1, // defaulting to one for now; m of n orders not supported in this release via FE
      startTimeMs,
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
  };

  const refreshData = () => {
    // updating fetchers triggers rebuild
    setRefreshTrigger(refreshTrigger + 1);
  };

  const value: AppContextType = {
    selectedChain,
    setSelectedChain,
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
    removeOrderFromSelection
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
