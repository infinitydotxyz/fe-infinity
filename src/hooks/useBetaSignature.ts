import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

const load = (address: string) => {
  const normalizedAddress = trimLowerCase(address);
  const storedSig = localStorage.getItem(`auth:sig:address:${normalizedAddress}`);
  const storedNonce = localStorage.getItem(`auth:nonce:address:${normalizedAddress}`);

  if (!storedSig || !storedNonce) {
    return null;
  }
  return {
    signature: storedSig,
    nonce: storedNonce
  };
};

export interface NotConnectedState {
  state: 'not-connected';
  address: null;
  signatureData: null;
}

export interface NotSignedInState {
  state: 'not-signed-in';
  address: string;
  signatureData: null;
}

export interface SignedInState {
  state: 'signed-in';
  address: string;
  signatureData: { signature: string; nonce: string };
}

export type BetaSignatureState = NotConnectedState | NotSignedInState | SignedInState;

export type BetaSignatureResult = {
  refresh: () => void;
  triggerSignature: () => void;
  isReady: boolean;
} & BetaSignatureState;

export const useBetaSignature = (): BetaSignatureResult => {
  const [isReady, setIsReady] = useState(false);
  const { isConnected, connector, address } = useAccount();
  const [triggerCounter, setTriggerCounter] = useState(0);
  const [result, setResult] = useState<BetaSignatureState>({
    state: 'not-connected',
    address: null,
    signatureData: null
  });

  const refresh = () => {
    setTriggerCounter(triggerCounter + 1);
  };

  const triggerSignature = async () => {
    const signer = await connector?.getSigner();
    if (!signer) {
      return;
    }

    const nonce = `${Date.now()}`;
    const domain = {
      name: 'Flow',
      version: '1'
    };
    const types = {
      Data: [
        { name: 'message', type: 'string' },
        { name: 'terms', type: 'string' },
        { name: 'nonce', type: 'uint256' }
      ]
    };
    const getData = (nonce: string) => {
      return {
        message: `Welcome to Flow. Click "Sign" to sign in. This is a one-time action. No password needed. This request will not trigger a blockchain transaction or cost any gas fees.`,
        terms: 'I accept the Flow Terms of Service: https://flow.so/terms',
        nonce
      };
    };

    const value = getData(nonce);

    try {
      const res = await signer._signTypedData(domain, types, value);

      const signingAddress = ethers.utils.verifyTypedData(domain, types, value, res);
      const normalizedAddress = trimLowerCase(signer._address);

      if (trimLowerCase(signingAddress) !== normalizedAddress) {
        throw new Error(`Address mismatch`);
      }

      localStorage.setItem(`auth:sig:address:${normalizedAddress}`, res);
      localStorage.setItem(`auth:nonce:address:${normalizedAddress}`, nonce);
    } catch (err) {
      console.log(err);
      return;
    }
    refresh();
  };

  useEffect(() => {
    if (!isConnected || !address) {
      setResult({ state: 'not-connected', address: null, signatureData: null });
    } else {
      const storedSig = load(address);
      if (storedSig) {
        setResult({ state: 'signed-in', address, signatureData: storedSig });
      } else {
        setResult({ state: 'not-signed-in', address, signatureData: null });
      }
    }

    if (!isConnected || (isConnected && address)) {
      setIsReady(true);
    }
  }, [address, triggerCounter, isConnected, setResult, setIsReady]);

  return {
    refresh,
    triggerSignature,
    isReady,
    ...result
  };
};
