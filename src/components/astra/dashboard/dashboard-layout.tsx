import { GridHeader, GridHeaderProps } from './grid-header';
import { useScrollInfo } from './useScrollHook';
import { apiGet } from 'src/utils';
import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import NotFound404Page from 'pages/not-found-404';
import { UserProfileDto } from '@infinityxyz/lib-frontend/types/dto';
import { OrderbookProvider } from 'src/components/orderbook/OrderbookContext';

// TODO: Upgrade to Next.js 13 to use layouts natively?
interface BaseDashboardProps {
  kind: 'collection' | 'profile';
  error?: Error;
}

interface ProfileDashboardProps extends BaseDashboardProps {
  kind: 'profile';
  user: UserProfileDto;
}

interface CollectionDashboardProps extends BaseDashboardProps {
  kind: 'collection';
  collection: BaseCollection;
}

export type DashboardProps = ProfileDashboardProps | CollectionDashboardProps;

export const DashboardLayout: React.FC<DashboardProps> = ({ children, error, ...props }) => {
  // const { setCollection } = useDashboardContext();
  const { setRef, scrollTop } = useScrollInfo();

  // useEffect(() => {
  //   if (collection) {
  //     setCollection(collection);
  //   }
  // }, [collection]);

  if (error) {
    if (props.kind === 'profile') {
      console.error('Failed to find profile', error);
    } else {
      // failed to load collection (collection not indexed?)
      return (
        <NotFound404Page
          collectionSlug={props.collection?.metadata.name.toString()}
          collectionAddress={props.collection?.address}
          chainId={props.collection?.chainId}
        />
      );
    }
  }

  switch (props.kind) {
    case 'profile': {
      const headerProps: GridHeaderProps = {
        expanded: scrollTop < 100,
        avatarUrl: props.user.profileImage,
        title: props.user.username,
        description: ''
      };

      return (
        // This is added just for the ASortButton, so remove if we change how this works
        <OrderbookProvider limit={50}>
          <div className="flex flex-col h-full w-full">
            <GridHeader {...headerProps}></GridHeader>
            <div ref={setRef} className="overflow-y-auto">
              {children}
            </div>
          </div>
        </OrderbookProvider>
      );
    }

    case 'collection': {
      const headerProps: GridHeaderProps = {
        expanded: scrollTop < 100,
        avatarUrl: props.collection.metadata.profileImage || props.collection.metadata.bannerImage,
        title: props.collection.metadata.name,
        description: props.collection.metadata.description,
        hasBlueCheck: props.collection.hasBlueCheck
      };

      const gridChildren = (
        <div className="flex flex-col items-end">
          <div className="text-lg whitespace-nowrap ml-3">{props.collection.numNfts} Nfts</div>
        </div>
      );
      return (
        // This is added just for the ASortButton, so remove if we change how this works
        <OrderbookProvider limit={50} collectionId={props.collection?.address}>
          <div className="flex flex-col h-full w-full">
            <GridHeader {...headerProps}>{gridChildren}</GridHeader>
            <div ref={setRef} className="overflow-y-auto">
              {children}
            </div>
          </div>
        </OrderbookProvider>
      );
    }
  }
};

export async function getServerSideProps(kind: DashboardProps['kind'], id: string): Promise<{ props: DashboardProps }> {
  switch (kind) {
    case 'collection': {
      const res = await apiGet(`/collections/${id}`);
      return {
        props: {
          // undefined fails, must pass null
          collection: res.result ?? null,
          error: res.error ?? null,
          kind: 'collection'
        }
      };
    }
    case 'profile': {
      const res = await apiGet(`/user/${id}`);
      return {
        props: {
          user: res.result ?? null,
          error: res.error ?? null,
          kind: 'profile'
        }
      };
    }
  }
}
