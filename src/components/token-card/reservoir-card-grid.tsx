import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { ErrorOrLoading } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { useResizeDetector } from 'react-resize-detector';
import { CardGrid } from './card-grid';
import { ReservoirProvider, useReservoir } from './reservoir-context';
import { CardProps } from './card';

interface Props {
  collection: BaseCollection;
  cardProps?: CardProps;
  className?: string;
}

export const ReservoirCards = ({ collection, className = '', cardProps }: Props) => {
  return (
    <ReservoirProvider collection={collection} limit={50}>
      <ReservoirCardGrid collection={collection} cardProps={cardProps} className={className} />
    </ReservoirProvider>
  );
};

const ReservoirCardGrid = ({ collection, className = '', cardProps }: Props) => {
  const [error, setError] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cardData, fetchOrders, hasNoData } = useReservoir();

  const [gridWidth, setGridWidth] = useState(0);

  const { width, ref } = useResizeDetector();
  // const isMounted = useIsMounted();

  const paddedImages = collection?.metadata.displayType === 'padded';

  useEffect(() => {
    setHasNextPage(false);
    setError(false);
    setLoading(true);
    handleFetch(false);
  }, []);

  useEffect(() => {
    setGridWidth(ref.current ? ref.current.offsetWidth : 0);
  }, [width]);

  const handleFetch = (loadMore: boolean) => {
    fetchOrders(loadMore);

    setLoading(false);
  };

  let contents;

  if (error || loading || hasNoData) {
    contents = <ErrorOrLoading error={error} noData={hasNoData} />;
  } else {
    let width = 0;

    if (gridWidth > 0) {
      width = gridWidth;
    }

    contents = (
      <CardGrid
        cardData={cardData}
        handleFetch={handleFetch}
        hasNextPage={hasNextPage}
        paddedImages={paddedImages}
        width={width}
        cardProps={cardProps}
      />
    );
  }

  return (
    <div ref={ref} className={twMerge(className, 'flex flex-col')}>
      <div className={twMerge(className, 'flex items-start mt-[60px]')}>{contents}</div>
    </div>
  );
};
