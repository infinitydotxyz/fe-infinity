import { CollectionActivityFeed } from '../feed/collection-activity-feed';

interface ActivityTabProps {
  collectionAddress?: string;
}

export const CollectionActivityTab = ({ collectionAddress }: ActivityTabProps) => {
  return <CollectionActivityFeed collectionAddress={collectionAddress ?? ''} />;
};
