import { CollectionMetadata } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PageBox } from 'src/components/common';
import { apiPut } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';

const DiscordIntegration = () => {
  const { query } = useRouter();
  const { user, chainId } = useAppContext();
  const [status, setStatus] = useState('Loading');

  const integrationType = query.type as string;
  const collectionAddress = query.address as string;

  useEffect(() => {
    if (!integrationType || !collectionAddress) {
      return;
    }

    if (!user?.address) {
      setStatus('Please connect your wallet.');
      return;
    }

    const metadata: Partial<CollectionMetadata> = {};

    if (integrationType === 'discord') {
      metadata.integrations = {
        discord: {
          guildId: query.guildId as string
        }
      };
    } else {
      setStatus('Unknown integration.');
      return;
    }

    (async () => {
      const { error } = await apiPut(`/user/${chainId}:${user?.address}/collections/${collectionAddress}`, {
        data: { metadata }
      });

      if (error) {
        console.error(error);
        setStatus('Error: ' + error?.errorResponse?.message);
        return;
      }

      setStatus('Integration enabled successfully. You may now close this page.'); // TODO: auto-redirect to homepage or collection after 3 seconds or so.
    })();
  }, [user, integrationType, collectionAddress]);

  return <PageBox title="Enable integration">{status}</PageBox>;
};

export default DiscordIntegration;
