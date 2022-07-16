import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { toastError } from 'src/components/common';
import { AppErrors } from 'src/utils/context/AppContext';
import { fetchUserSignedOBOrder } from 'src/utils/marketUtils';

export const useFetchSignedOBOrder = () => {
  const [signedOBOrder, setSignedOBOrder] = useState<SignedOBOrder | null>(null);

  const fetchSignedOBOrder = async (orderId: string) => {
    try {
      const signedOBOrder = await fetchUserSignedOBOrder(orderId);
      setSignedOBOrder(signedOBOrder);
      return signedOBOrder;
    } catch (err) {
      toastError(AppErrors.APP_ERR_FETCH_OB_ORDER);
    }
  };
  return { signedOBOrder, setSignedOBOrder, fetchSignedOBOrder };
};
