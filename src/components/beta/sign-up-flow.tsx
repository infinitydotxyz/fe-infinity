import { BetaAuthorizationComplete, BetaAuthorizationStatus, ReferralStep } from 'src/hooks/useSignUpState';
import { BouncingLogo, ClipboardButton, ConnectButton, ExternalLink, TextInputBox } from '../common';
import { AButton } from '../astra/astra-button';
import { TwitterConnect } from './twitter-connect';
import { DiscordConnect } from './discord-connect';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as BetaContext from 'src/utils/context/BetaContext';
import { SITE_HOST } from 'src/utils';
import { twMerge } from 'tailwind-merge';
import { iconButtonStyle, secondaryBgColor } from 'src/utils/ui-constants';
import { FaDiscord } from 'react-icons/fa';

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

  useEffect(() => {
    if (router.isReady && 'ref' in router.query && router.query.ref && typeof router.query.ref === 'string') {
      setReferralCode(router.query.ref);
    }
  }, [router.isReady, router.query]);

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
          <AButton onClick={triggerSignature} primary className={isLoading ? 'hidden' : 'relative py-3 px-6 text-sm'}>
            Sign up
          </AButton>

          <div className={isLoading ? 'relative' : 'hidden'}>
            <BouncingLogo />
          </div>
        </div>
      );
    }
    case 'signed-in': {
      switch (result.auth.status) {
        case BetaAuthorizationStatus.UnAuthorized: {
          if (result.auth.referral.step === ReferralStep.Incomplete) {
            return (
              <div className="mt-4 flex flex-col justify-center items-center">
                <div className={isLoading ? 'hidden' : 'flex flex-col items-start'}>
                  <div className="mb-4 flex">
                    Enter your referral code. Join our{' '}
                    <ExternalLink href="https://discord.gg/flowdotso">
                      <FaDiscord className={twMerge('text-brand-discord cursor-pointer mx-2', iconButtonStyle)} />
                    </ExternalLink>{' '}
                    to get one.
                  </div>

                  <div className="flex flex-row text-sm">
                    <TextInputBox
                      value={referralCode}
                      onChange={(value) => {
                        setReferralCode(value);
                      }}
                      type={'text'}
                      placeholder={'Referral code'}
                    />
                    <AButton primary className="ml-2 px-6 text-sm" onClick={submitReferralCode}>
                      Submit
                    </AButton>
                  </div>
                  <div className={referralCodeMessage ? 'flex flex-row text-sm text-yellow-300' : 'hidden'}>
                    {referralCodeMessage}
                  </div>
                </div>
                <div className={isLoading ? 'relative' : 'hidden'}>
                  <BouncingLogo />
                </div>
              </div>
            );
          }
          return (
            <div className="mt-4 flex flex-col justify-start items-center">
              <div className={isLoading ? 'hidden' : twMerge(secondaryBgColor, 'flex flex-row rounded-lg py-4')}>
                <div className="flex">
                  <TwitterConnect state={result.auth.twitter} />
                </div>
                <div className="flex">
                  <DiscordConnect state={result.auth.discord} />
                </div>
              </div>

              <div className={isLoading ? 'relative' : 'hidden'}>
                <BouncingLogo />
              </div>
            </div>
          );
        }
        case BetaAuthorizationStatus.Authorized: {
          const referralCode = (result.auth as BetaAuthorizationComplete).referralCode;
          return (
            <div className="flex flex-col items-start">
              <div className="flex flex-row justify-center items-center mb-4">
                <div className="flex space-x-3">
                  <div className="mt-2">Your referral link:</div>
                  <div className={twMerge(secondaryBgColor, 'flex rounded-lg p-2 space-x-2')}>
                    <div>{`${SITE_HOST}?ref=${referralCode}`} </div>
                    <ClipboardButton textToCopy={`${SITE_HOST}?ref=${referralCode}`} className={'h-5 w-5'} />
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-center">
                <AButton onClick={redirectToTrending} primary className="px-4 py-3 text-sm">
                  Get started
                </AButton>
              </div>
              <div className={isLoading ? 'relative' : 'hidden'}>
                <BouncingLogo />
              </div>
            </div>
          );
        }
      }
    }
  }
};
