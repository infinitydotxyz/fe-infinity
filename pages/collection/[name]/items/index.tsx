import { GetServerSidePropsContext } from 'next';
import { FC } from 'react';
import { AListGridButton } from 'src/components/astra';
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
import { TokensGrid } from 'src/components/astra/token-grid/token-grid';
import { useCollectionTokenFetcher } from 'src/components/astra/useFetcher';
import { Spacer } from 'src/components/common';
import { CollectionNftSearchInput } from 'src/components/common/search/collection-nft-search-input';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { inputBorderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

const GridWrapper: FC = () => {
  const { setNumTokens, tokenFetcher, isSelected, isSelectable, gridWidth, listMode, toggleSelection, collection } =
    useDashboardContext();

  const { data, error, hasNextPage, isLoading, fetch } = useCollectionTokenFetcher(collection?.address);

  return (
    <TokensGrid
      listMode={listMode}
      tokenFetcher={tokenFetcher}
      className="px-8 py-6"
      onClick={toggleSelection}
      wrapWidth={gridWidth}
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
  return (
    <DashboardLayout {...props}>
      <div className={twMerge(inputBorderColor, 'w-full flex   py-2 border-t-[1px]')}>
        <ASortButton />
        <AStatusFilterButton />
        <APriceFilter />
        <ATraitFilter />
        <CollectionNftSearchInput slug={(props as CollectionDashboardProps).asset.collection.slug} expanded />
        <Spacer />
        <AListGridButton />
      </div>
      <GridWrapper />
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const slug = context.query.name as string;
  return getDashboardServerSideProps('collection', slug);
}