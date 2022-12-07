import { CollectionTokenCache } from 'src/components/astra/token-grid/token-fetcher';
import { useEffect } from 'react';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { DashboardBase } from './dashboard-base';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export const DashboardAll = () => {
  const { setTokenFetcher, collection, refreshTrigger, setDisplayName, showOnlyUnvisible } = useDashboardContext();

  const { chainId } = useOnboardContext();

  useEffect(() => {
    if (collection && chainId) {
      setTokenFetcher(CollectionTokenCache.shared().fetcher(collection, chainId, showOnlyUnvisible));

      setDisplayName(collection?.name ?? '');
    }
  }, [collection, chainId, refreshTrigger]);

  return <DashboardBase />;
};
