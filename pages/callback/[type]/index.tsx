import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AButton } from 'src/components/astra/astra-button';
import { BouncingLogo } from 'src/components/common';
import { useBetaSignature } from 'src/hooks/useBetaSignature';
import { apiPost } from 'src/utils';
import * as BetaContext from 'src/utils/context/BetaContext';

interface TwitterCallback {
  kind: 'twitter';
  code: string;
  state: string;
}

interface DiscordCallback {
  kind: 'discord';
  code: string;
}

interface ErrorCallback {
  kind: 'error';
  message: string;
}

const useCallbackState = () => {
  const router = useRouter();

  const [state, setState] = useState<TwitterCallback | DiscordCallback | ErrorCallback | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!router.isReady) {
      setState(null);
      setIsReady(false);
    } else {
      const type = router.query.type;

      if (!type) {
        setState({ kind: 'error', message: 'Failed to connect' });
        return;
      }

      const code = router.query.code;
      const twitterState = router.query.state;
      if (type === 'discord' && code && typeof code === 'string') {
        setState({
          kind: 'discord',
          code
        });
      } else if (
        type === 'twitter' &&
        code &&
        twitterState &&
        typeof twitterState === 'string' &&
        typeof code === 'string'
      ) {
        setState({
          kind: 'twitter',
          code,
          state: twitterState
        });
      } else {
        setState({ kind: 'error', message: 'Failed to connect' });
      }

      setIsReady(true);
    }
  }, [router.isReady]);

  return {
    isReady,
    state
  };
};

export default function Callback() {
  const router = useRouter();
  const { refresh } = BetaContext.use();

  const { state, isReady } = useCallbackState();
  const { state: sigState, signatureData, address } = useBetaSignature();

  const [redirectSuccessful, setRedirectSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [successful, setSuccessful] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');
    if (!isReady) {
      return;
    }

    if (state === null) {
      return;
    } else if (state.kind === 'error') {
      setSuccessful(false);
      setErrorMessage('Invalid url, please close this tab and try again');
    }

    const signal = { aborted: false };

    const submitTwitterCode = async (
      address: string,
      data: { code: string; state: string },
      sigData: { signature: string; nonce: string }
    ) => {
      setIsLoading(true);
      try {
        const { result, status } = await apiPost(`/v2/users/${address}/beta/auth/twitter/callback`, {
          data: data,
          options: {
            headers: {
              'x-auth-signature': sigData.signature,
              'x-auth-nonce': sigData.nonce
            }
          }
        });

        if (status === 201) {
          if (result.success) {
            refresh();
            setSuccessful(true);
          } else {
            setErrorMessage(result.message ?? 'Failed to connect. Please try again');
          }
        } else {
          console.error(`Unexpected status code: ${status} ${result}`);
        }

        if (!signal.aborted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);

        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    const submitDiscordToken = async (
      address: string,
      data: { code: string },
      sigData: { signature: string; nonce: string }
    ) => {
      setIsLoading(true);
      try {
        const { result, status } = await apiPost(`/v2/users/${address}/beta/auth/discord/callback`, {
          data: data,
          options: {
            headers: {
              'x-auth-signature': sigData.signature,
              'x-auth-nonce': sigData.nonce
            }
          }
        });

        if (status === 201) {
          if (result.success) {
            refresh();
            setSuccessful(true);
          } else {
            setErrorMessage(result.message ?? 'Failed to connect. Please try again');
          }
        } else {
          console.error(`Unexpected status code: ${status} ${result}`);
        }

        if (!signal.aborted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);

        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    switch (sigState) {
      case 'not-connected':
        break;
      case 'not-signed-in':
        break;
      case 'signed-in':
        if (state.kind === 'twitter') {
          setRedirectSuccessful(true);
          submitTwitterCode(address, state, signatureData);
        } else if (state.kind === 'discord') {
          setRedirectSuccessful(true);
          submitDiscordToken(address, state, signatureData);
        }
    }

    return () => {
      signal.aborted = true;
    };
  }, [sigState, state, isReady]);

  useEffect(() => {
    if (successful) {
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  }, [successful]);

  return (
    <div className="h-full w-full m-6">
      <div className="w-full h-full flex flex-col m-auto text-center justify-center">
        <div className="w-full my-4">
          <h2 className="text-2xl font-heading font-bold center w-full">Welcome to Flow</h2>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className={redirectSuccessful && isLoading ? 'flex' : 'hidden'}>
            <div>Connecting...</div>
            <BouncingLogo />
          </div>

          <div className={redirectSuccessful && !isLoading ? 'flex flex-col' : 'hidden'}>
            {successful ? 'Connected! Redirecting...' : `${errorMessage || 'Failed to connect. Please try again'}`}
          </div>
          <AButton
            onClick={() => {
              router.push('/');
            }}
            primary
            className={isLoading || successful ? 'hidden' : 'flex mt-2'}
          >
            Return
          </AButton>
        </div>
      </div>
    </div>
  );
}
