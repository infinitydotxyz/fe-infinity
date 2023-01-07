import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { FC } from 'react';
import { APriceFilter } from 'src/components/astra/astra-price-filter';
import { ASortButton } from 'src/components/astra/astra-sort-button';
import { AStatusFilterButton } from 'src/components/astra/astra-status-button';
import { ATraitFilter } from 'src/components/astra/astra-trait-filter';
import {
  CollectionDashboardProps,
  DashboardLayout,
  DashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { TokenGrid } from 'src/components/astra/token-grid/token-grid';
import { useCollectionTokenFetcher } from 'src/components/astra/useFetcher';
import { Spacer } from 'src/components/common';
import { CollectionNftSearchInput } from 'src/components/common/search/collection-nft-search-input';
import { useDashboardContext } from 'src/utils/context/DashboardContext';

const GridWrapper: FC = () => {
  const { setNumTokens, tokenFetcher, isSelected, isSelectable, listMode, toggleSelection, collection } =
    useDashboardContext();

  if (!collection) {
    return null;
  }

  const { data, error, hasNextPage, isLoading, fetch } = useCollectionTokenFetcher(collection.address);

  return (
    <TokenGrid
      listMode={listMode}
      tokenFetcher={tokenFetcher}
      className="px-8 py-6"
      onClick={toggleSelection}
      isSelectable={isSelectable}
      isSelected={isSelected}
      onLoad={setNumTokens}
      data={data}
      hasNextPage={hasNextPage}
      onFetchMore={() => fetch(true)}
      isError={!!error}
      isLoading={!!isLoading}
    />
  );
};

export default function ItemsPage(props: DashboardProps) {
  const collection = (props as CollectionDashboardProps).asset.collection;

  const head = (
    <Head>
      <meta property="og:title" content={collection.metadata?.name} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://infinity.xyz/collection/${collection?.slug}`} />
      <meta property="og:site_name" content="infinity.xyz" />
      <meta property="og:image" content={collection.metadata?.bannerImage || collection.metadata?.profileImage} />
      <meta property="og:image:alt" content={collection.metadata?.description} />
      <meta property="og:description" content={collection.metadata?.description} />

      <meta name="theme-color" content="#000000" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@infinitydotxyz" />
      <meta name="twitter:title" content={collection.metadata?.name} />
      <meta name="twitter:description" content={collection.metadata?.description} />
      <meta name="twitter:image" content={collection.metadata?.bannerImage || collection.metadata?.profileImage} />
      <meta property="twitter:image:alt" content={collection.metadata?.description} />
      <meta property="twitter:creator" content={collection.metadata?.links?.twitter} />
    </Head>
  );

  return (
    <DashboardLayout {...props}>
      {head}
      <div className="w-full flex mt-3 px-8">
        <div className="flex">
          <CollectionNftSearchInput slug={collection.slug} expanded />
        </div>
        <Spacer />
        <div className="flex space-x-2">
          <ASortButton />
          <AStatusFilterButton />
          <APriceFilter />
          <ATraitFilter />
        </div>
      </div>
      <GridWrapper />
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const slug = context.query.name as string;
  return getDashboardServerSideProps('collection', slug);
}
