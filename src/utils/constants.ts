import missing from 'src/images/missing-image.png';

export const API_BASE = 'http://localhost:9090';
// export const API_BASE = 'https://sv.infinity.xyz/';

export const SITE_HOST = 'http://localhost:3000';
export const DISCORD_BOT_INVITE_URL =
  'https://discord.com/api/oauth2/authorize?client_id=956292440778743838&permissions=1024&scope=bot%20applications.commands';

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

export const DEFAULT_MAX_GAS_PRICE_WEI = '100000000000';

// todo: find better images
export const BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
export const BLANK_IMAGE_URL = missing.src;

export const GRID_CSS =
  'grid grid1:grid-cols-1 grid2:grid-cols-2 grid3:grid-cols-3 grid4:grid-cols-4 grid5:grid-cols-5 grid6:grid-cols-6 grid7:grid-cols-7 grid8:grid-cols-8 gap-x-8 gap-y-12';

export const ENS_ADDRESS = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'.toLowerCase();
