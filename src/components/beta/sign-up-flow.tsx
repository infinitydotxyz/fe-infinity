import { BetaAuthorizationStatus, useSignUpState } from 'src/hooks/useSignUpState';
import { BouncingLogo, ConnectButton } from '../common';
import { AButton } from '../astra/astra-button';
import { TwitterConnect } from './twitter-connect';
import { DiscordConnect } from './discord-connect';

export const SignUpFlow = () => {
  const { isLoading, result, triggerSignature } = useSignUpState();

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
