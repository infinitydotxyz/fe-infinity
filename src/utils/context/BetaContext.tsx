import React, { ReactNode, useEffect, useState } from 'react';
import { BetaAuthorizationStatus, SignUpState, useSignUpState } from 'src/hooks/useSignUpState';
import { useAppContext } from './AppContext';
import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';

type BetaContextType = SignUpState;

const BetaContext = React.createContext<BetaContextType>(null as unknown as BetaContextType);

export const BetaConsumer = BetaContext.Consumer;

interface Props {
  children: ReactNode;
}

const allowedRoutes = ['/beta', '/callback', '/not-found-404', '/privacy-policy', '/terms'];
const create = () => {
  const {
    isLoading,
    refresh,
    isReady,
    triggerSignature,
    state,
    referralCode,
    setReferralCode,
    submitReferralCode,
    referralCodeMessage
  } = useSignUpState();
  const { selectedChain } = useAppContext();
  const router = useRouter();

  const [nonce, setNonce] = useState(0);

  const trigger = () => {
    setNonce((prev) => prev + 1);
  };

  useEffect(() => {
    const handleRouteChange = () => {
      trigger();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    if (allowedRoutes.some((item) => router.route.includes(item))) {
      return;
    }
    if (isLoading || !isReady) {
      return;
    }
    if (selectedChain === ChainId.Mainnet) {
      // require the user to be authorized
      if (state.status !== 'signed-in') {
        router.push('/beta');
      } else if (state.auth.status !== BetaAuthorizationStatus.Authorized) {
        router.push('/beta');
      }
    }
  }, [state, selectedChain, isLoading, nonce]);

  return {
    referralCode,
    setReferralCode,
    submitReferralCode,
    referralCodeMessage,
    isReady,
    isLoading,
    refresh,
    triggerSignature,
    state
  };
};

export const BetaProvider = (p: Props) => <BetaContext.Provider value={create()} {...p} />;
export const use = () => React.useContext(BetaContext);
export default { Context: BetaContext, Provider: BetaProvider, Consumer: BetaConsumer, use, create };
