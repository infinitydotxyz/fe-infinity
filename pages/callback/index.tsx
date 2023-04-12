import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BouncingLogo } from 'src/components/common';
import { useBetaSignature } from 'src/hooks/useBetaSignature';
import { apiPost } from 'src/utils';

export default function Callback() {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const { state: sigState, signatureData, address } = useBetaSignature();

  const [redirectSuccessful, setRedirectSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [successful, setSuccessful] = useState(false);

  useEffect(() => {
    if (!router.isReady) {
      setCode(null);
      setState(null);
      setIsReady(false);
    } else {
      setCode(router.query.code as string);
      setState(router.query.state as string);
      setIsReady(true);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const signal = { aborted: false };

    const submitCode = async (
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
            setSuccessful(true);
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
        if (code && state && typeof code === 'string' && typeof state === 'string') {
          setRedirectSuccessful(true);
          submitCode(address, { code, state }, signatureData);
        } else {
          setRedirectSuccessful(false);
        }
    }

    return () => {
      signal.aborted = true;
    };
  }, [sigState, code, state, isReady]);

  useEffect(() => {
    if (successful) {
      setTimeout(() => {
        router.push('/beta');
      }, 2000);
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

          <div className={redirectSuccessful && !isLoading ? 'flex' : 'hidden'}>
            {successful ? 'Connected! Redirecting...' : 'Failed to connect. Please try again.'}
          </div>

          <div className={!redirectSuccessful ? 'flex' : 'hidden'}>Failed to connect. Please try again.</div>
        </div>
      </div>
    </div>
  );
}
