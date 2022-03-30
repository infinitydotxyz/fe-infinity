import type { FC } from 'react';
import { Button } from 'src/components/common';

const ViewToggle: FC = () => {
  return (
    <div>
      <Button>NFT</Button>
      <Button>Game</Button>
    </div>
  );
};

export default ViewToggle;
