import { Button, Heading } from '../common';
import { CuratedTab } from './types';

export type NoResultsBoxProps = {
  tab?: CuratedTab;
  onClick: () => void;
};

/**
 * Component to render when no curations have been found.
 */
export const NoResultsBox: React.FC<NoResultsBoxProps> = ({ tab, onClick, children }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-12 bg-theme-light-200 p-10 rounded-lg">
      <Heading as="h3" className="font-body font-medium text-3xl">
        {tab === CuratedTab.AllCurated && <span>No collections have been curated yet</span>}
        {tab === CuratedTab.MyCurated && <span>You haven't curated any collections yet</span>}
        {!tab && children}
      </Heading>
      <Button size="large" className="mt-8" onClick={onClick}>
        Curate now
      </Button>
    </div>
  );
};
