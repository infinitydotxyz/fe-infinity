export const API_BASE =
  process.env.APP_ENV === 'prod'
    ? 'https://sv.infinity.xyz'
    : process.env.APP_ENV === 'dev'
    ? 'https://sv-dev.nftcompany.com'
    : 'http://localhost:9090';

export const SITE_HOST =
  process.env.APP_ENV === 'prod'
    ? 'https://infinity.xyz'
    : process.env.APP_ENV === 'dev'
    ? 'https://dev.nftcompany.com'
    : 'http://localhost:3000';
export const ITEMS_PER_PAGE = 50;
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const PAGE_NAMES = {
  EXPLORE: 'explore',
  MY_NFTS: 'my-nfts',
  LISTED_NFTS: 'listed-nfts',
  USER_NFTS: 'user-nfts',
  OFFERS_MADE: 'offers-made',
  OFFERS_RECEIVED: 'offers-received',
  COLLECTION: 'collection'
};

export const NFT_DATA_SOURCES = {
  INFINITY: 0,
  OPENSEA: 1,
  UNMARSHAL: 2,
  ALCHEMY: 3,
  COVALENT: 4
};

// eth
export const ETHEREUM_NETWORK_NAME = 'main';
export const PROVIDER_URL_MAINNET = 'https://eth-mainnet.alchemyapi.io/v2/umiR3YUjFlvlrDNOQQltWppf2M-p07Q3';
export const CHAIN_SCANNER_BASE = 'https://etherscan.io';
export const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

// polygon
export const POLYGON_NETWORK_NAME = 'polygon';
export const PROVIDER_URL_POLYGON = 'https://polygon-rpc.com/';
export const POLYGON_CHAIN_SCANNER_BASE = 'https://polygonscan.com';
export const POLYGON_WETH_ADDRESS = '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619';

export const LOGIN_MESSAGE =
  'Welcome to Infinity. Click "Sign" to sign in. No password needed. This request will not trigger a blockchain transaction or cost any gas fees.';

// ADI: added to get commonUtils compiling, might be old
export const LISTING_TYPE = {
  FIXED_PRICE: 'fixedPrice',
  DUTCH_AUCTION: 'dutchAuction',
  ENGLISH_AUCTION: 'englishAuction'
};
