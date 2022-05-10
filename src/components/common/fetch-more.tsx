import React from 'react';
import { InView } from 'react-intersection-observer';
import { ITEMS_PER_PAGE } from 'src/utils/constants';

type FetchMoreElementProps = {
  inView: boolean;
  ref?: React.LegacyRef<HTMLSpanElement>;
  onFetchMore: () => void;
  data?: unknown[];
  currentPage?: number;
};

const FetchMoreElement = ({ inView, ref, onFetchMore, data, currentPage }: FetchMoreElementProps) => {
  React.useEffect(() => {
    if (inView === true && onFetchMore) {
      if (currentPage === 0 && data && data?.length < ITEMS_PER_PAGE) {
        return; // return if it's the first page with less items.
      }
      onFetchMore();
    }
  }, [inView]);
  return <span ref={ref}>&nbsp;</span>; // render a placeholder to check if it's visible (inView) or not.
};

type FetchMoreProps = {
  onFetchMore: () => void;
  data?: unknown[];
  currentPage?: number;
};

export const FetchMore = ({ onFetchMore, data, currentPage }: FetchMoreProps) => {
  return (
    <InView>
      {({ inView, ref }) => {
        return (
          <div ref={ref}>
            <FetchMoreElement inView={inView} onFetchMore={onFetchMore} data={data} currentPage={currentPage} />
          </div>
        );
      }}
    </InView>
  );
};
