import { EIP712Data } from '@infinityxyz/lib-frontend/types/core/orderbook/generate/signer-request';
import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { verifyTypedData } from 'ethers/lib/utils.js';
import { useEffect, useState } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';

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

const LOGIN_NONCE_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000;

export function useUserSignature(): {
  signature: { error: 'Wallet not connected' | 'User not signed in' } | Signature;
  sign: () => Promise<void>;
  isSigning: boolean;
} {
  const { address: user } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const [sig, setSig] = useState<Signature | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    if (!sig || !user) {
      return;
    }

    const isValid = verifySignature(sig.sig, sig.nonce, user);
    if (!isValid) {
      return;
    }
    setCachedSignature(sig);
  }, [sig, user, verifySignature, setCachedSignature]);

  useEffect(() => {
    if (!user) {
      setSig(null);
      return;
    }
    const cachedSig = getCachedSignature(user);

    if (cachedSig && Date.now() - cachedSig.nonce < LOGIN_NONCE_EXPIRY_TIME) {
      setSig(cachedSig);
    }
  }, [user, setSig, getCachedSignature, LOGIN_NONCE_EXPIRY_TIME]);

  const sign = async () => {
    const nonce = Date.now();
    const data = getLoginMessage(nonce.toString());
    if (!user) {
      return;
    }

    setIsSigning(true);
    try {
      const res = await signTypedDataAsync(data as unknown as Record<string, unknown>);

      setSig({
        address: user,
        nonce: nonce,
        sig: res
      });
    } catch (err) {
      console.error(err);
    }
    setIsSigning(false);
  };

  if (!user) {
    return {
      signature: { error: 'Wallet not connected' },
      sign,
      isSigning
    };
  }

  if (!sig) {
    return {
      signature: { error: 'User not signed in' },
      sign,
      isSigning
    };
  }

  return {
    signature: sig,
    sign,
    isSigning
  };
}
