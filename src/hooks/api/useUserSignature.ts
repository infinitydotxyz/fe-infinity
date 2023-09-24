import { EIP712Data } from '@infinityxyz/lib-frontend/types/core/orderbook/generate/signer-request';
import { LOGIN_NONCE_EXPIRY_TIME, trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { verifyTypedData } from 'ethers/lib/utils.js';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { SignTypedDataArgs, signTypedData } from '@wagmi/core';

export interface Signature {
  address: string;
  nonce: number;
  sig: string;
}

const getCachedSignature = (address: string) => {
  const sig = localStorage.getItem(`signature:${trimLowerCase(address)}`);

  if (!sig) {
    return null;
  }
  try {
    return JSON.parse(sig) as Signature;
  } catch (err) {
    return null;
  }
};

const setCachedSignature = (signature: Signature) => {
  localStorage.setItem(`signature:${trimLowerCase(signature.address)}`, JSON.stringify(signature));
};

function getLoginMessage(nonce: string): Omit<EIP712Data, 'domain'> & { domain: { name: string; version: string } } {
  const domain = {
    name: 'Pixl',
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
      message: `Welcome to Pixl. Click "Sign" to sign in. This is a one-time action. No password needed. This request will not trigger a blockchain transaction or cost any gas fees.`,
      terms: 'I accept the Pixl Terms of Service: https://pixl.so/terms',
      nonce
    };
  };

  const value = getData(nonce);

  return {
    signatureKind: 'eip712',
    domain: domain,
    types,
    value
  };
}

const verifySignature = (signature: string, nonce: number, expectedSigner: string) => {
  const { domain, types, value } = getLoginMessage(nonce.toString());
  const signingAddress = trimLowerCase(verifyTypedData(domain, types, value as Record<string, unknown>, signature));

  return signingAddress === trimLowerCase(expectedSigner);
};

export function useUserSignature() {
  const { address: user } = useAccount();
  const [error, setError] = useState<'Wallet not connected' | 'User not signed in' | null>(null);
  const [sig, setSig] = useState<null | Signature>(null);
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    if (!user) {
      setError('Wallet not connected');
      setSig(null);
      return;
    }
    const cachedSig = getCachedSignature(user);

    if (cachedSig && Date.now() - cachedSig.nonce < LOGIN_NONCE_EXPIRY_TIME) {
      setSig(cachedSig);
      setError(null);
    } else {
      setError('User not signed in');
      setSig(null);
    }
  }, [user, setSig, getCachedSignature, LOGIN_NONCE_EXPIRY_TIME]);

  const sign = async () => {
    if (!user || isSigning) {
      return;
    }

    setIsSigning(true);
    const nonce = Date.now();
    const data = getLoginMessage(nonce.toString());
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await signTypedData(data as unknown as SignTypedDataArgs<any>);
      const isValid = verifySignature(res, nonce, user);
      if (!isValid) {
        console.warn(`Signature is invalid for user ${user}`);
        setSig(null);
        setError('User not signed in');
        setIsSigning(false);
        return;
      }

      const sig = {
        address: user,
        nonce,
        sig: res
      };
      setSig(sig);
      setError(null);
      setCachedSignature(sig);
    } catch (err) {
      console.error(err);
    }
    setIsSigning(false);
  };

  return {
    error: error,
    signature: sig,
    sign,
    isSigning
  };
}
