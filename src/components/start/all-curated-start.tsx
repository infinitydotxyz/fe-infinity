import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import React, { useEffect, useState } from 'react';
import { apiGet } from 'src/utils';
import { CenteredContent, Spinner } from '../common';
import { CuratedCollectionDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections.dto';
import { CuratedSwiper } from './curated-swiper';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

interface Props {
  orderBy: CuratedCollectionsOrderBy;
}

export const AllCuratedStart: React.FC<Props> = ({ orderBy }) => {
  const { user, chainId } = useOnboardContext();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [data, setData] = useState<CuratedCollectionDto[]>([]);

  const query = {
    orderBy,
    orderDirection: 'desc',
    limit: 12
  };

  const fetch = async () => {
    const { result, error } = await apiGet(
      '/collections/curated/' + (user?.address ? `${chainId}:${user?.address}` : ''),
      {
        requiresAuth: !!user?.address,
        query
      }
    );

    setIsLoading(false);

    if (!error) {
      setData(result?.data as CuratedCollectionDto[]);
    } else {
      console.log(error);
      setHasError(true);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div>
      {hasError ? <div className="flex flex-col mt-10">Unable to load curated collections.</div> : null}

      {data.length > 0 && (
        <div>
          <CuratedSwiper collections={data} />
        </div>
      )}

      {data.length === 0 && (
        <CenteredContent>
          <div>Nothing Found</div>
        </CenteredContent>
      )}

      {isLoading && <Spinner />}
    </div>
  );
};
