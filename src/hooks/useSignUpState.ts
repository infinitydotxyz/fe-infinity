import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useEffect, useState } from 'react';
import { apiGet, apiPost } from 'src/utils';
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
  Verify,
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

export interface VerifyDiscord {
  step: Discord.Verify;
}

export interface CompletedDiscord {
  step: Discord.Complete;
}

export enum BetaAuthorizationStatus {
  UnAuthorized,
  Authorized
}

export enum ReferralStep {
  Incomplete,
  Complete
}

export interface InitialReferralStatus {
  step: ReferralStep.Incomplete;
}

export interface CompletedReferralStatus {
  step: ReferralStep.Complete;
  referralCode: string;
}

export interface BetaAuthorizationIncomplete {
  status: BetaAuthorizationStatus;
  referral: InitialReferralStatus | CompletedReferralStatus;
  twitter: ConnectTwitter | FollowOnTwitter | CompletedTwitter;
  discord: ConnectDiscord | JoinDiscord | VerifyDiscord | CompletedDiscord;
}

export interface BetaAuthorizationComplete {
  status: BetaAuthorizationStatus.Authorized;
  referralCode: string;
}

export type BetaAuthorization = BetaAuthorizationIncomplete | BetaAuthorizationComplete;

export interface BetaSignUpFlowPreSig {
  status: 'not-connected' | 'not-signed-in';
}

export interface BetaSignUpFlowPostSig {
  status: 'signed-in';
  auth: BetaAuthorization;
}

export type BetaSignUpFlow = BetaSignUpFlowPreSig | BetaSignUpFlowPostSig;

export interface SignUpState {
  referralCode: string;
  setReferralCode: (code: string) => void;
  submitReferralCode: () => void;
  referralCodeMessage: string;
  isReady: boolean;
  triggerSignature: () => void;
  refresh: () => void;
  isLoading: boolean;
  state: BetaSignUpFlow;
}

export const useSignUpState = (): SignUpState => {
  const { state: sigState, address, signatureData, triggerSignature, isReady } = useBetaSignature();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralCodeNonce, setReferralCodeNonce] = useState(0);
  const [referralCodeMessage, setReferralCodeMessage] = useState('');
  const [isInternalReady, setIsInternalReady] = useState(false);

  useEffect(() => {
    if (referralCodeMessage) {
      setReferralCodeMessage('');
    }
  }, [referralCode]);

  const [isLoading, setIsLoading] = useState(false);
  const [nonce, setNonce] = useState(0);

  const [state, setState] = useState<BetaSignUpFlow>({
    status: 'not-connected'
  });

  useEffect(() => {
    const signal = { aborted: false };
    if (!isReady) {
      return;
    }

    if (sigState === 'not-connected') {
      setState({ status: 'not-connected' });
      setIsInternalReady(true);
      return;
    } else if (sigState === 'not-signed-in') {
      setState({ status: 'not-signed-in' });
      setIsInternalReady(true);
      return;
    }
    const normalizedAddress = trimLowerCase(address);

    const status = 'signed-in';
    const fetchSignUpState = async () => {
      setIsLoading(true);

      try {
        const {
          status: statusCode,
          error,
          result
        } = await apiGet(`/v2/users/${normalizedAddress}/beta/auth`, {
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
        if (statusCode === 200) {
          const data: BetaAuthorization = result;
          setState({ status, auth: data });
          setIsLoading(false);
          setIsInternalReady(true);
        } else {
          console.error(error);
          console.error(status);
          setState({ status: 'not-signed-in' });
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

  useEffect(() => {
    const signal = { aborted: false };
    if (!isReady) {
      return;
    }

    if (sigState !== 'signed-in') {
      return;
    }

    const submitReferralCode = async () => {
      setIsLoading(true);
      setReferralCodeMessage('');

      try {
        const normalizedAddress = trimLowerCase(address);
        const { status, result } = await apiPost(`/v2/users/${normalizedAddress}/beta/auth/referral`, {
          query: {
            referralCode
          },
          options: {
            headers: {
              'x-auth-signature': signatureData.signature,
              'x-auth-nonce': signatureData.nonce
            }
          }
        });

        if (status === 201) {
          const data: { success: true; referralStatus: CompletedReferralStatus } | { success: false; message: string } =
            result;

          if (data.success) {
            setReferralCode('');
            refresh();
            return;
          } else {
            setReferralCodeMessage(data.message);
          }
        } else {
          setReferralCodeMessage('Failed to submit, please try again.');
        }
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        if (!signal.aborted) {
          setIsLoading(false);
          setReferralCodeMessage('Failed to submit, please try again.');
        }
      }
    };

    submitReferralCode();

    return () => {
      signal.aborted = true;
    };
  }, [referralCodeNonce]);

  const refresh = () => {
    setNonce((prev) => prev + 1);
  };

  const submitReferralCode = () => {
    setReferralCodeNonce((prev) => prev + 1);
  };

  return {
    isReady: isInternalReady,
    state: state,
    isLoading,
    refresh,
    triggerSignature,
    referralCode,
    setReferralCode,
    submitReferralCode,
    referralCodeMessage
  };
};
