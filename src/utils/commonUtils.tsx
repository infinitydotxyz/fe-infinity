import { getAddress } from '@ethersproject/address';
import {
  ETHEREUM_CHAIN_SCANNER_BASE,
  POLYGON_CHAIN_SCANNER_BASE,
  trimLowerCase
} from '@infinityxyz/lib-frontend/utils';
import { ReactNode } from 'react';
import { NextLink } from 'src/components/common';

// OpenSea's EventType
export enum EventType {
  // Transactions and signature requests
  TransactionCreated = 'TransactionCreated',
  TransactionConfirmed = 'TransactionConfirmed',
  TransactionDenied = 'TransactionDenied',
  TransactionFailed = 'TransactionFailed',

  // Basic actions: matching orders, creating orders, and cancelling orders
  MatchOrders = 'MatchOrders',
  CancelOrder = 'CancelOrder',
  ApproveOrder = 'ApproveOrder',
  CreateOrder = 'CreateOrder',
  // When the signature request for an order is denied
  OrderDenied = 'OrderDenied',

  ApproveCurrency = 'ApproveCurrency'
}

export const base64Encode = (data: string) => Buffer.from(data).toString('base64');

export const base64Decode = (data?: string) => Buffer.from(data ?? '', 'base64').toString();

export const isServer = () => typeof window === 'undefined';

export const isLocalhost = () => !isServer() && (window?.location?.host || '').indexOf('localhost') >= 0;

export const toChecksumAddress = (address?: string): string => {
  if (address) {
    let result = address;

    try {
      // this crashes if the address isn't valid
      result = getAddress(address);
    } catch (err) {
      // do nothing
    }

    return result;
  }

  return '';
};

// use ellipsisString for non-address numbers, this gets the checksum address
export const ellipsisAddress = (address?: string, left = 6, right = 4) => {
  return ellipsisString(toChecksumAddress(address), left, right);
};

export const addressesEqual = (left?: string, right?: string): boolean => {
  if (left && right) {
    return trimLowerCase(left) === trimLowerCase(right);
  }

  return false;
};

export const ellipsisString = (inString?: string, left = 6, right = 4): string => {
  if (inString) {
    // don't do anything if less than a certain length
    if (inString.length > left + right + 5) {
      return `${inString.slice(0, left)}\u{02026}${inString.slice(-right)}`;
    } else {
      return inString;
    }
  }

  return '';
};

// parse a Timestamp string (in millis or secs)
export const parseTimestampString = (dt: string, inSecond = false): Date | null => {
  let dateObj = null;
  if (!dt || dt === '0') {
    return null;
  }
  try {
    const dtNum = parseInt(dt);
    dateObj = new Date(dtNum * (inSecond ? 1000 : 1));
  } catch (err) {
    console.error(err);
  }
  return dateObj;
};

export const stringToFloat = (numStr?: string, defaultValue = 0) => {
  let num = defaultValue;
  if (!numStr) {
    return num;
  }
  try {
    num = parseFloat(numStr);
  } catch (e) {
    console.error(e);
  }
  return num;
};

// example: formatNumber(1025.12) => '1,025'
export const formatNumber = (floatNum: number | undefined, decimals = 0): string => {
  if (decimals) {
    const str = (floatNum ?? 0).toLocaleString('en-US');
    return str.slice(0, str.indexOf('.') + decimals + 1);
  } else {
    const str = Math.round(floatNum ?? 0).toLocaleString('en-US');
    return str;
  }
};

export const getCustomExceptionMsg = (msg: ReactNode) => {
  let customMsg = msg;
  if (typeof msg === 'string' && msg.indexOf('err: insufficient funds for gas * price + value') > 0) {
    customMsg = 'Insufficient funds for gas * price + value';
  }
  if (typeof msg === 'string' && msg.indexOf('User denied transaction signature.') > 0) {
    customMsg = 'MetaMask: User denied transaction signature';
  }
  return customMsg;
};

// makes number strings from strings or numbers
export const numStr = (value: string | number): string => {
  let short;

  if (typeof value === 'undefined' || value === null) {
    short = '';
  } else if (typeof value === 'string') {
    if (value.includes('.')) {
      const f = parseFloat(value);
      if (f) {
        short = f.toFixed(4);
      }
    }
    short = value;
  } else {
    short = value.toFixed(4);
  }

  // remove .0000
  let zeros = '.0000';
  if (short.endsWith(zeros)) {
    short = short?.substring(0, short.length - zeros.length);
  }

  // .9800 -> .98
  if (short.includes('.')) {
    zeros = '00';
    if (short?.endsWith(zeros)) {
      short = short.substring(0, short.length - zeros.length);
    }
  }

  const p = parseFloat(short);
  if (!isNaN(p)) {
    // this adds commas
    short = p.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 });
  }

  return short;
};

export const getChainScannerBase = (chainId?: string): string | null => {
  if (chainId === '1') {
    return ETHEREUM_CHAIN_SCANNER_BASE;
  } else if (chainId === '137') {
    return POLYGON_CHAIN_SCANNER_BASE;
  }
  return null;
};

export const PleaseConnectMsg = () => (
  <>
    Please click{' '}
    <NextLink href="/connect" className="font-bold">
      Connect
    </NextLink>{' '}
    to sign in.
  </>
);

export const truncateDecimals = (numStr: string) => {
  return ((numStr ?? '') + ' ').slice(0, numStr.indexOf('.'));
};

export const getLoginMessage = (nonce: number): string => {
  // ignore the formatting of this multiline string
  const msg = `Welcome to Infinity. Click "Sign" to sign in. No password needed. This request will not trigger a blockchain transaction or cost any gas fees.
 
I accept the Infinity Terms of Service: https://infinity.xyz/terms

Nonce: ${nonce}
Expires in: 24 hrs`;

  return msg;
};
