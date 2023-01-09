import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { getToken } from '@infinityxyz/lib-frontend/utils';
import missingImage from 'src/images/missing-image.png';
import newsImage from 'src/images/news.png';

export const API_BASE = 'http://localhost:9090';
export const SITE_HOST = 'http://localhost:3000';
export const DISCORD_BOT_INVITE_URL =
  'https://discord.com/api/oauth2/authorize?client_id=956292440778743838&permissions=1024&scope=bot%20applications.commands';

export const ETHERSCAN_BASE_URL = 'https://etherscan.io';

export const INFINITY_FEE_PCT = 2.5;
export const INFINITY_ROYALTY_PCT = 0;

// not sure why there are two of these.
export const ITEMS_PER_PAGE = 30;
export const DEFAULT_LIMIT = 24;
export const LARGE_LIMIT = 50;

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
export const NEWS_IMAGE_URL = newsImage.src;

export const GRID_CSS =
  'grid grid1:grid-cols-1 grid2:grid-cols-2 grid3:grid-cols-3 grid4:grid-cols-4 grid5:grid-cols-5 grid6:grid-cols-6 grid7:grid-cols-7 grid8:grid-cols-8 gap-x-8 gap-y-12';

export const ENS_ADDRESS = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'.toLowerCase();

export const USER_API_END_POINT = '/user';

export const TOKEN = getToken(ChainId.Mainnet) ?? {
  address: '',
  name: 'Infinity',
  symbol: 'INFT',
  decimals: 18,
  chainId: ChainId.Mainnet
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
