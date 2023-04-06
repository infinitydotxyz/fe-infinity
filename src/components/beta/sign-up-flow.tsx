import { BetaAuthorizationStatus } from 'src/hooks/useSignUpState';
import { BouncingLogo, ConnectButton } from '../common';
import { AButton } from '../astra/astra-button';
import { TwitterConnect } from './twitter-connect';
import { DiscordConnect } from './discord-connect';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { use } from 'src/utils/context/BetaContext';

export const SignUpFlow = () => {
  const router = useRouter();
  const { isLoading, state: result, triggerSignature, refresh } = use();

  const [, setIsWindowActive] = useState(true);

  useEffect(() => {
    const signal = { aborted: false };
    const handleBlur = () => {
      setIsWindowActive(false);
    };

    const handleFocus = () => {
      setIsWindowActive((prev) => {
        if (prev === false) {
          if (result.state === 'signed-in' && result.auth.status === BetaAuthorizationStatus.Authorized) {
            return true;
          }
          if (isLoading) {
            return true;
          }
          refresh();
        }
        return true;
      });
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      signal.aborted = true;
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [refresh]);

  useEffect(() => {
    if (result.state === 'signed-in' && result.auth.status === BetaAuthorizationStatus.Authorized) {
      setTimeout(() => {
        router.push('/trending');
      }, 2000);
    }
  }, [result]);

  switch (result?.state) {
    case 'not-connected': {
      return (
        <div className="mt-4">
          <ConnectButton />
        </div>
      );
    }
    case 'not-signed-in': {
      return (
        <div className="mt-4">
          <div className={isLoading ? 'flex' : 'hidden'}>
            <BouncingLogo />
          </div>

          <AButton onClick={triggerSignature} primary>
            Sign In
          </AButton>
        </div>
      );
    }
    case 'signed-in': {
      switch (result.auth.status) {
        case BetaAuthorizationStatus.UnAuthorized: {
          return (
            <div className="mt-4 flex flex-col justify-center items-center">
              <div className={isLoading ? 'flex' : 'hidden'}>
                <BouncingLogo />
              </div>
              <div className={isLoading ? 'hidden' : 'flex'}>
                Connect your Twitter and Discord accounts to continue.
              </div>

              <div className="border-1 flex flex-row">
                <div className="flex">
                  <TwitterConnect state={result.auth.twitter} />
                </div>
                <div className="flex">
                  <DiscordConnect state={result.auth.discord} />
                </div>
              </div>
            </div>
          );
        }
        case BetaAuthorizationStatus.Authorized: {
          return <div>Authorized!</div>;
        }
      }
    }
  }
};
