import { CollectionActivityFeed } from '../feed/collection-activity-feed';

interface ActivityTabProps {
  collectionAddress?: string;
}

export const CollectionSalesTab = ({ collectionAddress }: ActivityTabProps) => {
  return <CollectionActivityFeed collectionAddress={collectionAddress ?? ''} />;
};
