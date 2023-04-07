import { BetaAuthorizationComplete, BetaAuthorizationStatus, ReferralStep } from 'src/hooks/useSignUpState';
import { BouncingLogo, ClipboardButton, ConnectButton, TextInputBox } from '../common';
import { AButton } from '../astra/astra-button';
import { TwitterConnect } from './twitter-connect';
import { DiscordConnect } from './discord-connect';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as BetaContext from 'src/utils/context/BetaContext';

export const SignUpFlow = () => {
  const router = useRouter();
  const {
    isLoading,
    state: result,
    triggerSignature,
    refresh,
    referralCode,
    setReferralCode,
    referralCodeMessage,
    submitReferralCode
  } = BetaContext.use();

  const [, setIsWindowActive] = useState(true);

  useEffect(() => {
    const signal = { aborted: false };
    const handleBlur = () => {
      setIsWindowActive(false);
    };

    const handleFocus = () => {
      setIsWindowActive((prev) => {
        if (prev === false) {
          if (result.status === 'signed-in' && result.auth.status === BetaAuthorizationStatus.Authorized) {
            return true;
          }
          if (isLoading) {
            return true;
          }

          if (
            result?.status === 'signed-in' &&
            result.auth.status === BetaAuthorizationStatus.UnAuthorized &&
            result.auth.referral.step === ReferralStep.Incomplete
          ) {
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
  }, [refresh, result, setIsWindowActive]);

  const redirectToTrending = () => {
    router.push('/trending');
  };

  switch (result?.status) {
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
          if (result.auth.referral.step === ReferralStep.Incomplete) {
            return (
              <div className="mt-4 flex flex-col justify-center items-center">
                <div className={isLoading ? 'flex' : 'hidden'}>
                  <BouncingLogo />
                </div>
                <div className={isLoading ? 'hidden' : 'flex flex-col items-start'}>
                  <p className="mb-2">Enter your referral code</p>

                  <div className="flex flex-row">
                    <TextInputBox
                      value={referralCode}
                      onChange={(value) => {
                        setReferralCode(value);
                      }}
                      type={'text'}
                      placeholder={'Referral code'}
                    />
                    <AButton primary className="ml-2" onClick={submitReferralCode}>
                      Submit
                    </AButton>
                  </div>
                  <div className={referralCodeMessage ? 'flex flex-row text-sm text-yellow-300' : 'hidden'}>
                    {referralCodeMessage}
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div className="mt-4 flex flex-col justify-start items-center">
              <div className="flex flex-row">
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
          const referralCode = (result.auth as BetaAuthorizationComplete).referralCode;
          return (
            <div className="flex flex-col items-start">
              <div className="flex flex-row justify-center items-center">
                <div className="mb-2">Your referral code: {referralCode}</div>
                <ClipboardButton textToCopy={referralCode} className={'h-4 w-4 ml-2.5 mb-1.5'} />
              </div>
              <div className="flex w-full justify-center">
                <AButton onClick={redirectToTrending} primary>
                  Get started
                </AButton>
              </div>
            </div>
          );
        }
      }
    }
  }
};
