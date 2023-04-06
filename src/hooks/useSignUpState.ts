import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils';
import { useBetaSignature } from './useBetaSignature';

export enum Twitter {
  Connect,
  Follow,
  Complete
}

export interface ConnectTwitter {
  step: Twitter.Connect;
  data: {
    url: string;
  };
}

export interface FollowOnTwitter {
  step: Twitter.Follow;
  data: {
    url: string;
  };
}

export interface CompletedTwitter {
  step: Twitter.Complete;
}

export enum Discord {
  Connect,
  Join,
  Complete
}

export interface ConnectDiscord {
  step: Discord.Connect;
  data: {
    url: string;
  };
}

export interface JoinDiscord {
  step: Discord.Join;
  data: {
    url: string;
  };
}

export interface CompletedDiscord {
  step: Discord.Complete;
}

export enum BetaAuthorizationStatus {
  UnAuthorized,
  Authorized
}

export interface BetaAuthorizationIncomplete {
  status: BetaAuthorizationStatus;
  twitter: ConnectTwitter | FollowOnTwitter | CompletedTwitter;
  discord: ConnectDiscord | JoinDiscord | CompletedDiscord;
}

export interface BetaAuthorizationComplete {
  status: BetaAuthorizationStatus.Authorized;
}

export type BetaAuthorization = BetaAuthorizationIncomplete | BetaAuthorizationComplete;

export interface BetaSignUpFlowPreSig {
  state: 'not-connected' | 'not-signed-in';
}

export interface BetaSignUpFlowPostSig {
  state: 'signed-in';
  auth: BetaAuthorization;
}

export type BetaSignUpFlow = BetaSignUpFlowPreSig | BetaSignUpFlowPostSig;

export interface SignUpState {
  isReady: boolean;
  triggerSignature: () => void;
  refresh: () => void;
  isLoading: boolean;
  state: BetaSignUpFlow;
}

export const useSignUpState = (): SignUpState => {
  const { state: sigState, address, signatureData, triggerSignature, isReady } = useBetaSignature();

  const [isInternalReady, setIsInternalReady] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [nonce, setNonce] = useState(0);

  const [state, setState] = useState<BetaSignUpFlow>({
    state: 'not-connected'
  });

  useEffect(() => {
    const signal = { aborted: false };
    if (!isReady) {
      return;
    }

    if (sigState === 'not-connected') {
      setState({ state: 'not-connected' });
      setIsInternalReady(false);
      return;
    } else if (sigState === 'not-signed-in') {
      setState({ state: 'not-signed-in' });
      setIsInternalReady(true);
      return;
    }
    const normalizedAddress = trimLowerCase(address);

    const state = 'signed-in';
    const fetchSignUpState = async () => {
      setIsLoading(true);

      try {
        const { status, error, result } = await apiGet(`/v2/users/${normalizedAddress}/beta/auth`, {
          options: {
            headers: {
              'x-auth-signature': signatureData.signature,
              'x-auth-nonce': signatureData.nonce
            }
          }
        });
        if (signal.aborted) {
          return;
        }
        if (status === 200) {
          const data: BetaAuthorization = result;
          setState({ state, auth: data });
          setIsLoading(false);
          setIsInternalReady(true);
        } else {
          console.error(error);
          console.error(status);
          setState({ state: 'not-signed-in' });
          setIsLoading(false);
          setIsInternalReady(true);
        }
      } catch (err) {
        console.error(err);
        if (!signal.aborted) {
          setIsLoading(false);
          setIsInternalReady(true);
        }
      }
    };

    fetchSignUpState();

    return () => {
      signal.aborted = true;
    };
  }, [nonce, address, signatureData, sigState, isReady]);

  const refresh = () => {
    setNonce((prev) => prev + 1);
  };

  return {
    isReady: isInternalReady,
    state: state,
    isLoading,
    refresh,
    triggerSignature
  };
};
