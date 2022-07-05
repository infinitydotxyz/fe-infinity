import { Button } from '../common';
import { CuratedTab } from './types';

export type NoResultsBoxProps = {
  tab: CuratedTab;
};

/**
 * Component to render when no curations have been found.
 */
export const NoResultsBox: React.FC<NoResultsBoxProps> = ({ tab }) => {
  return (
    <div className="text-center">
      <p className="font-body font-medium">
        {tab === CuratedTab.AllCurated && <span>No collections have been curated yet</span>}
        {tab === CuratedTab.MyCurated && <span>You haven't curated any collections yet</span>}
      </p>
      <Button className="mt-2">Curate now</Button>
    </div>
  );
};
