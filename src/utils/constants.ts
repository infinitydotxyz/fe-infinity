import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { getToken } from '@infinityxyz/lib-frontend/utils';
import missingImage from 'src/images/missing-image.png';
import { AddressZero } from '@ethersproject/constants';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://sv.pixl.so';
export const SITE_HOST = process.env.NEXT_PUBLIC_SITE_HOST || 'https://pixl.so';
export const DISCORD_BOT_INVITE_URL =
  'https://discord.com/api/oauth2/authorize?client_id=956292440778743838&permissions=1024&scope=bot%20applications.commands';

export const ETHERSCAN_BASE_URL = 'https://etherscan.io';

export const SEASON_2_UNLOCK_BLOCK = 18490808;

export const FEE_BPS = 250;
export const ROYALTY_BPS = 500;
export const FEE_WALLET_ADDRESS = '0xbFFc957B7537295B138dB43FB1843FeFF1782a20';

export const DEFAULT_LIMIT = 30;
export const SMALL_LIMIT = 10;
export const LARGE_LIMIT = 50;
export const EXTRA_LARGE_LIMIT = 100;

export const NFT_DATA_SOURCES = {
  INFINITY: 0,
  OPENSEA: 1,
  UNMARSHAL: 2,
  ALCHEMY: 3,
  COVALENT: 4
};

export const DEFAULT_MAX_GAS_PRICE_WEI = '500000000000'; // 500 gwei
export const GAS_LIMIT_BUFFER = 1.1;

export const NFT_TOTAL_SUPPLY = 2_000_000_000;

export const PLACEHOLDER_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
export const MISSING_IMAGE_URL = missingImage.src;

export const GRID_CSS =
  'grid grid1:grid-cols-1 grid2:grid-cols-2 grid3:grid-cols-3 grid4:grid-cols-4 grid5:grid-cols-5 grid6:grid-cols-6 grid7:grid-cols-7 grid8:grid-cols-8 gap-x-8 gap-y-12';

export const ENS_ADDRESS = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'.toLowerCase();

export const USER_API_END_POINT = '/user';

export const INFT_TOKEN = getToken(ChainId.Mainnet) ?? {
  address: '',
  name: 'Infinity',
  symbol: 'INFT',
  decimals: 18,
  chainId: ChainId.Mainnet
};

export const FLOW_TOKEN = getToken(ChainId.Mainnet) ?? {
  address: '',
  name: 'XFL Token',
  symbol: 'XFL',
  decimals: 18,
  chainId: ChainId.Mainnet
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000';

export const ORDER_ROOT_EIP712_TYPES = {
  Root: [{ name: 'root', type: 'bytes32' }]
};

export const FLOW_ORDER_EIP_712_TYPES = {
  Order: [
    { name: 'isSellOrder', type: 'bool' },
    { name: 'signer', type: 'address' },
    { name: 'constraints', type: 'uint256[]' },
    { name: 'nfts', type: 'OrderItem[]' },
    { name: 'execParams', type: 'address[]' },
    { name: 'extraParams', type: 'bytes' }
  ],
  OrderItem: [
    { name: 'collection', type: 'address' },
    { name: 'tokens', type: 'TokenInfo[]' }
  ],
  TokenInfo: [
    { name: 'tokenId', type: 'uint256' },
    { name: 'numTokens', type: 'uint256' }
  ]
};

export enum Network {
  // Mainnets
  Ethereum = 1,
  Optimism = 10,
  Bsc = 56,
  Polygon = 137,
  Base = 8453,
  Arbitrum = 42161,
  ArbitrumNova = 42170,
  Avalanche = 43114,
  Linea = 59144,
  Zora = 7777777,
  PolygonZkevm = 1101,
  // Testnets
  EthereumGoerli = 5,
  ZoraTestnet = 999,
  MantleTestnet = 5001,
  LineaTestnet = 59140,
  Mumbai = 80001,
  BaseGoerli = 84531,
  ScrollAlpha = 534353,
  EthereumSepolia = 11155111,
  Zksync = 324,
  Ancient8Testnet = 2863311531
}

export type ChainIdToAddress = { [chainId: number]: string };

// Native currency
export const Native: ChainIdToAddress = {
  [Network.Ethereum]: AddressZero,
  [Network.EthereumGoerli]: AddressZero,
  [Network.EthereumSepolia]: AddressZero,
  [Network.Bsc]: AddressZero,
  [Network.Optimism]: AddressZero,
  [Network.Polygon]: AddressZero,
  [Network.Arbitrum]: AddressZero,
  [Network.ArbitrumNova]: AddressZero,
  [Network.Avalanche]: AddressZero,
  [Network.Mumbai]: AddressZero,
  [Network.ScrollAlpha]: AddressZero,
  [Network.MantleTestnet]: AddressZero,
  [Network.LineaTestnet]: AddressZero,
  [Network.ZoraTestnet]: AddressZero,
  [Network.Zora]: AddressZero,
  [Network.Base]: AddressZero,
  [Network.BaseGoerli]: AddressZero,
  [Network.Linea]: AddressZero,
  [Network.Zksync]: AddressZero,
  [Network.PolygonZkevm]: AddressZero,
  [Network.Ancient8Testnet]: AddressZero
};

// Wrapped native currency
export const WNative: ChainIdToAddress = {
  [Network.Ethereum]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [Network.EthereumGoerli]: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
  [Network.EthereumSepolia]: '0x7b79995e5f793a07bc00c21412e50ecae098e7f9',
  [Network.Bsc]: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  [Network.Optimism]: '0x4200000000000000000000000000000000000006',
  [Network.Polygon]: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  [Network.Arbitrum]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  [Network.ArbitrumNova]: '0x722e8bdd2ce80a4422e880164f2079488e115365',
  [Network.Avalanche]: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
  [Network.Mumbai]: '0x9c3c9283d3e44854697cd22d3faa240cfb032889',
  [Network.Zora]: '0x4200000000000000000000000000000000000006',
  [Network.ZoraTestnet]: '0x4200000000000000000000000000000000000006',
  [Network.Base]: '0x4200000000000000000000000000000000000006',
  [Network.BaseGoerli]: '0x4200000000000000000000000000000000000006',
  [Network.Linea]: '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f',
  [Network.LineaTestnet]: '0x2c1b868d6596a18e32e61b901e4060c872647b6c',
  [Network.ScrollAlpha]: '0x7160570bb153edd0ea1775ec2b2ac9b65f1ab61b',
  [Network.MantleTestnet]: '0xbaafec4b6ef4f5e0bafa850cbc48364b953efcf9',
  [Network.Zksync]: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
  [Network.PolygonZkevm]: '0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9',
  [Network.Ancient8Testnet]: '0x4200000000000000000000000000000000000015'
};
