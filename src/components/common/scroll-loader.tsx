import React, { forwardRef } from 'react';
import { InView } from 'react-intersection-observer';

interface Props {
  inView: boolean;
  onFetchMore: () => void;
  bottom: boolean;
}

const ScrollLoaderElement = forwardRef<HTMLDivElement, Props>(({ inView, bottom, onFetchMore }, ref): JSX.Element => {
  React.useEffect(() => {
    if (inView === true && onFetchMore) {
      onFetchMore();
    }
  }, [inView]);

  // the style sets a relative offset -200 so that it will trigger earlier
  return <div ref={ref} className={bottom ? 'absolute -bottom-96 h-10 w-10' : 'absolute -top-96 h-10 w-10'}></div>;
});

ScrollLoaderElement.displayName = 'Scroll Loader';

// ===========================================================

interface ScrollLoaderProps {
  onFetchMore: () => void;
}

export const ScrollLoader = ({ onFetchMore }: ScrollLoaderProps) => {
  return (
    <>
      <InView>
        {({ inView, ref }) => {
          return (
            <div className="relative">
              <ScrollLoaderElement ref={ref} bottom={false} inView={inView} onFetchMore={onFetchMore} />
            </div>
          );
        }}
      </InView>

      {/* Not sure why I added this bottom.  Might be to handle cases where a result is smaller than a full page 
        It can lead to double loads, so fix that if enabled */}

      {/* <InView>
        {({ inView, ref }) => {
          return (
            <div className="relative">
              <ScrollLoaderElement ref={ref} bottom={true} inView={inView} onFetchMore={onFetchMore} />
            </div>
          );
        }}
      </InView> */}
    </>
  );
};
