import { GetServerSidePropsContext } from 'next';
import { FC } from 'react';
import {
  DashboardLayout,
  DashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { TokensGrid } from 'src/components/astra/token-grid/token-grid';
import { useCollectionTokenFetcher } from 'src/components/astra/useFetcher';
import { useDashboardContext } from 'src/utils/context/DashboardContext';

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
      <GridWrapper />
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const slug = context.query.name as string;
  return getDashboardServerSideProps('collection', slug);
}
