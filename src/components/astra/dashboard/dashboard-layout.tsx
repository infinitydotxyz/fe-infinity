import { GridHeader } from './grid-header';
import { useScrollInfo } from './useScrollHook';
import { OrderbookProvider } from 'src/components/orderbook/OrderbookContext';
import { GetServerSidePropsContext } from 'next';
import { apiGet } from 'src/utils';
import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import NotFound404Page from 'pages/not-found-404';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { useEffect } from 'react';

// TODO: Upgrade to Next.js 13 to use layouts natively?

export type DashBoardProps = { collection?: BaseCollection; error?: Error };

export const DashboardLayout: React.FC<DashBoardProps> = ({ children, collection, error }) => {
  const { setCollection } = useDashboardContext();
  const { setRef, scrollTop } = useScrollInfo();

  useEffect(() => {
    if (collection) {
      setCollection(collection);
    }
  }, [collection]);

  const expanded = scrollTop < 100;

  if (error) {
    // failed to load collection (collection not indexed?)
    return (
      <NotFound404Page
        collectionSlug={collection?.slug.toString()}
        collectionAddress={collection?.address}
        chainId={collection?.chainId}
      />
    );
  }

  return (
    // This is added just for the ASortButton, so remove if we change how this works
    <OrderbookProvider limit={50} collectionId={collection?.address}>
      <div className="flex flex-col h-full w-full">
        <GridHeader expanded={expanded} />
        <div ref={setRef} className="overflow-y-auto">
          {children}
        </div>
      </div>
    </OrderbookProvider>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const slug = context.query.name;
  const res = await apiGet(`/collections/${slug}`);

  return {
    // undefined fails, must pass null
    props: { collection: res.result ?? null, error: res.error ?? null }
  };
}
