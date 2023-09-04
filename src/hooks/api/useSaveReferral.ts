import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { apiPut } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';

const getCachedReferrer = (user: string) => {
  const cachedReferrer = localStorage.getItem(`referrer:${user}`);
  if (cachedReferrer) {
    return cachedReferrer;
  }
  return null;
};

const saveCachedReferrer = (user: string, referralCode: string) => {
  localStorage.setItem(`referrer:${user}`, referralCode);
};

export const useSaveReferral = () => {
  const { query } = useRouter();
  const { signature } = useAppContext();
  const [hasCachedReferral, setHasCachedReferral] = useState(true);

  useEffect(() => {
    if (!signature) {
      return;
    }
    const user = signature.address;
    const cache = getCachedReferrer(user);
    setHasCachedReferral(!!cache);
  }, [signature, getCachedReferrer, setHasCachedReferral]);

  useEffect(() => {
    if (!signature) {
      return;
    }

    if (hasCachedReferral) {
      return;
    }

    const user = signature.address;
    const referralCode = query.referrer;
    if (user && referralCode && typeof referralCode === 'string') {
      apiPut(`/pixl/rewards/user/${user}/referrals`, {
        data: {
          code: referralCode
        },
        options: {
          headers: {
            'x-auth-nonce': signature.nonce,
            'x-auth-signature': signature.sig
          }
        }
      })
        .then(() => {
          saveCachedReferrer(user, referralCode);
        })
        .catch((err) => console.error(err));
    }
  }, [hasCachedReferral, signature, query.referrer, apiPut, saveCachedReferrer]);
};
